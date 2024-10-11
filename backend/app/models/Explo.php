<?php

namespace Model;

class Explo extends ActiveRecord
{

    // Base DE DATOS
    protected static $table = 'exploradores';
    protected static $columnsDB = ['nombres', 'apellidos', 'fecha_nacimiento', 'ascenso_id', 'fecha_promesacion', 'cargo', 'cedula', 'telefono', 'email', 'destacamento_id'];

    public static function get_exploradores($destacamento, $rama, $id, $searchTerm, $page, $limit)
    {
        //añadir al final luego de todas las validaciones
        $inicio= ($page - 1) * $limit;
        // primera parte de la consulta
        $query = "SELECT exploradores.*, CASE
        WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN 3 AND 5 THEN 'pre-junior'
        WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN 6 AND 10 THEN 'pionero'
        WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN 11 AND 17 THEN 'brijer'
        WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) >= 18 THEN 'oficial'
        ELSE 'no clasificado'
        END AS rama,
        destacamentos.nombre AS destacamento FROM exploradores
        INNER JOIN destacamentos ON exploradores.destacamento_id = destacamentos.id ";

        // se añade destacamento a la query si es que existe 
        if ($destacamento) {
            $query .= " WHERE destacamentos.nombre = '" . self::$db->escape_string($destacamento) . "'";
        }
        // si existe un término de busqueda se añade a la query, evaluando también si existe destacamente para saber si usar where o and
        if($searchTerm != ''){
            if($destacamento){
                $query.= " AND exploradores.nombres LIKE " . "'%" . self::$db->escape_string($searchTerm) . "%'";
            } else{
                $query.= " WHERE exploradores.nombres LIKE " . "'%" . self::$db->escape_string($searchTerm) . "%'";
            }
        }
        // se añade rama si es que existe, se usa having ya que rama es una columna calculada, no se puede usar where
        if($rama != null){
            $query .= " HAVING rama = '" . self::$db->escape_string($rama) . "'"; 
            
        }
        // se añade 
        $query.= " LIMIT " . $inicio . ", " . self::$db->escape_string($limit);
        
        // echo($query);
        // exit;
        
        $result= static::$db->query($query);
        
        $exploradores=[];

        if($result){
            while($row= $result->fetch_assoc()){
                $exploradores[] = $row; 
            }
        }else{
            echo 'Error en la ejecución de la consulta: ' . static::$db->error;
        }

        return $exploradores;
    }
}
