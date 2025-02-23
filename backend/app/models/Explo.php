<?php

namespace Model;

use function Controllers\debuguear;

class Explo extends ActiveRecord
{

    // Base DE DATOS
    protected static $table = 'exploradores';
    protected static $columnsDB = ['id', 'nombres', 'apellidos', 'fecha_nacimiento', 'ascenso_id', 'fecha_promesacion', 'cargo', 'cedula', 'telefono', 'email', 'destacamento_id'];

    public $id;
    public $nombres;
    public $apellidos;
    public $fecha_nacimiento;
    public $ascenso_id;
    public $fecha_promesacion;
    public $cargo;
    public $cedula;
    public $telefono;
    public $email;
    public $destacamento_id;

    public function __construct($arg = [])
    {
        $this->id = $arg['id'] ?? null;
        $this->nombres = $arg['nombres'] ?? '';
        $this->apellidos = $arg['apellidos'] ?? '';
        $this->fecha_nacimiento = $arg['fecha_nacimiento'] ?? '';
        $this->ascenso_id = $arg['ascenso_id'] ?? '';
        $this->fecha_promesacion = $arg['fecha_promesacion'] ?? '';
        $this->cargo = $arg['cargo'] ?? '';
        $this->cedula = $arg['cedula'] ?? '';
        $this->telefono = $arg['telefono'] ?? '';
        $this->email = $arg['email'] ?? '';
        $this->destacamento_id = $arg['destacamento_id'] ?? '';
    }

    public function validar()
    {
        // el backend valida que los campos obligatorios no esten vacios.
        if (!$this->nombres) {
            self::$errors[] = "El campo nombre es obligatorio";
        }

        if (!$this->apellidos) {
            self::$errors[] = 'El campo apellidos es obligatorio';
        }

        if (!$this->fecha_nacimiento) {
            self::$errors[] = 'El campo fecha_nacimiento es obligatorio';
        }

        if (!$this->fecha_promesacion) {
            self::$errors[] = 'El campo fecha_nacimiento es obligatorio';
        }

        if (!$this->destacamento_id) {
            self::$errors[] = 'El campo destacamento_id es obligatorio';
        }

        return self::$errors;
    }

    public static function get_exploradores($destacamento, $rama, $ascenso, $searchTerm, $page, $limit, $all)
    {
        // primera parte de la consulta
        $query = "SELECT
            ex.id, 
            ex.nombres, 
            ex.apellidos, 
            DATE_FORMAT(ex.fecha_nacimiento, '%d-%m-%Y') AS fecha_nacimiento, 
            DATE_FORMAT(ex.fecha_promesacion, '%d-%m-%Y') AS fecha_promesacion, 
            ex.cargo, 
            ex.cedula, 
            ex.telefono, 
            ex.email,
            TIMESTAMPDIFF(YEAR, ex.fecha_nacimiento, CURDATE()) AS edad, 
            CASE
                WHEN TIMESTAMPDIFF(YEAR, ex.fecha_nacimiento, CURDATE()) BETWEEN 3 AND 5 THEN 'pre-junior'
                WHEN TIMESTAMPDIFF(YEAR, ex.fecha_nacimiento, CURDATE()) BETWEEN 6 AND 10 THEN 'pionero'
                WHEN TIMESTAMPDIFF(YEAR, ex.fecha_nacimiento, CURDATE()) BETWEEN 11 AND 17 THEN 'brijer'
                WHEN TIMESTAMPDIFF(YEAR, ex.fecha_nacimiento, CURDATE()) >= 18 THEN 'oficial'
                ELSE 'no clasificado'
            END AS rama,
            destacamentos.nombre AS destacamento,
            ascensos.nombre AS ascenso 
        FROM 
            exploradores AS ex
        INNER JOIN 
            destacamentos ON ex.destacamento_id = destacamentos.id
        LEFT JOIN 
        ascensos ON ex.ascenso_id = ascensos.id";

        $inicio = ($limit * ($page - 1));

        // se añade destacamento a la query si es que existe 
        if ($destacamento != null) {
            $query .= " WHERE destacamentos.id = '" . self::$db->escape_string($destacamento) . "'";
        }
        // si existe un término de busqueda se añade a la query, evaluando también si existe destacamente para saber si usar where o and
        if ($searchTerm != null) {
            if ($destacamento) {
                $query .= " AND ex.nombres LIKE " . "'%" . self::$db->escape_string($searchTerm) . "%'";
            } else {
                $query .= " WHERE ex.nombres LIKE " . "'%" . self::$db->escape_string($searchTerm) . "%'";
            }
        }

        if ($ascenso != null) {
            if ($destacamento || $searchTerm != '') {
                $query .= " AND ascensos.id =  " . self::$db->escape_string($ascenso);
            } else {
                $query .= " WHERE ascensos.id =  " . self::$db->escape_string($ascenso);
            }
        }
        // se añade rama si es que existe, se usa having ya que rama es una columna calculada, no se puede usar where
        if ($rama != null) {
            $query .= " HAVING rama = '" . self::$db->escape_string($rama) . "'";
        }

        if($all === false){
            // se añade inicio y limite
            $query .= " LIMIT " . self::$db->escape_string($limit) . " OFFSET " . $inicio;
        }
        
        $result = static::$db->query($query);

        $exploradores = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $exploradores[] = $row;
            }
        } else {
            echo 'Error en la ejecución de la consulta: ' . static::$db->error;
        }

        return $exploradores;
    }

    public static function get_exploradores_count($destacamento, $rama, $ascenso, $searchTerm)
    {
        $query = "SELECT COUNT(*) AS total
        FROM (
            SELECT
                CASE
                    WHEN TIMESTAMPDIFF(YEAR, ex.fecha_nacimiento, CURDATE()) BETWEEN 3 AND 5 THEN 'pre-junior'
                    WHEN TIMESTAMPDIFF(YEAR, ex.fecha_nacimiento, CURDATE()) BETWEEN 6 AND 10 THEN 'pionero'
                    WHEN TIMESTAMPDIFF(YEAR, ex.fecha_nacimiento, CURDATE()) BETWEEN 11 AND 17 THEN 'brijer'
                    WHEN TIMESTAMPDIFF(YEAR, ex.fecha_nacimiento, CURDATE()) >= 18 THEN 'oficial'
                    ELSE 'no clasificado'
                END AS rama
            FROM 
                exploradores AS ex
            INNER JOIN 
                destacamentos ON ex.destacamento_id = destacamentos.id
            LEFT JOIN 
                ascensos ON ex.ascenso_id = ascensos.id";

        // Se añade destacamento a la consulta si existe
        if ($destacamento) {
            $query .= " WHERE destacamentos.id = '" . self::$db->escape_string($destacamento) . "'";
        }

        // Añadir búsqueda si existe searchTerm
        if ($searchTerm) {
            if ($destacamento) {
                $query .= " AND ex.nombres LIKE '%" . self::$db->escape_string($searchTerm) . "%'";
            } else {
                $query .= " WHERE ex.nombres LIKE '%" . self::$db->escape_string($searchTerm) . "%'";
            }
        }

        // Filtro de ascenso si existe
        if ($ascenso) {
            if ($destacamento || $searchTerm) {
                $query .= " AND ascensos.id = " . self::$db->escape_string($ascenso);
            } else {
                $query .= " WHERE ascensos.id = " . self::$db->escape_string($ascenso);
            }
        }

        // Agrupamos por rama
        $query .= ") AS subquery";

        // Filtramos por rama si existe, usando HAVING ya que es una columna calculada
        if ($rama) {
            $query .= " WHERE rama = '" . self::$db->escape_string($rama) . "'";
        }

        $result = static::$db->query($query);

        $cuenta = 0;

        if ($result) {
            $cuenta = $result->fetch_assoc();
        } else {
            echo 'Error en la ejecución de la consulta: ' . static::$db->error;
        }

        return $cuenta['total'];
    }
}
