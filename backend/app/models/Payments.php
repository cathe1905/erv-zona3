<?php

namespace Model;

use function Controllers\debuguear;

class Payments extends ActiveRecord
{
    protected static $table = 'pagos';
    protected static $columnsDB = ['id', 'oficial_id', 'mes', 'monto', 'responsable_id', 'fecha_pago', 'solicitud_id', 'destacamento_id'];

    public $id;
    public $oficial_id;
    public $mes;
    public $monto;
    public $responsable_id;
    public $fecha_pago;
    public $solicitud_id;
    public $destacamento_id;

    public function __construct($arg = [])
    {
        $this->id = $arg['id'] ?? null;
        $this->oficial_id = $arg['oficial_id'] ?? '';
        $this->mes = $arg['mes'] ?? '';
        $this->monto = $arg['monto'] ?? '';
        $this->responsable_id = $arg['responsable_id'] ?? '';
        $this->fecha_pago = $arg['fecha_pago'] ?? '';
        $this->solicitud_id = $arg['solicitud_id'] ?? '';
        $this->destacamento_id = $arg['destacamento_id'] ?? '';
    }

    public function validar()
    {
        self::$errors = [];
        // el backend valida que los campos obligatorios no esten vacios.
        if (!$this->responsable_id) {
            self::$errors[] = "El campo responsable_id es obligatorio";
        }

        if (!$this->destacamento_id) {
            self::$errors[] = 'El campo destacamento_id es obligatorio';
        }

        if (!$this->oficial_id) {
            self::$errors[] = 'El campo oficial_id es obligatorio';
        }

        if (!$this->mes) {
            self::$errors[] = 'El campo mes es obligatorio';
        }

        if (!$this->monto) {
            self::$errors[] = 'El campo monto es obligatorio';
        }

        if (!$this->fecha_pago) {
            self::$errors[] = 'El campo valor_cuota es obligatorio';
        }

        if (!$this->solicitud_id) {
            self::$errors[] = 'El campo monto es obligatorio';
        }


        return self::$errors;
    }

    public static function crear_pago($multiple_objects)
    {
        //comienzo la transaccion, donde guardaré las consultas momentaneamentes
        self::$db->query("START TRANSACTION");

        try {
            //limpio y sanitizo todas las entradas y guardo el registro.
            foreach ($multiple_objects as $pago) {

                $atributos = $pago->sanitizarAtributos();
                //si algo sale mal caerá al catch y deshará los registros anteriores.
                if (!self::guardar($atributos)) {
                    throw new \Exception('Error al guardar el registro.');
                }
            }
            //guarda permanentemente en base de datos
            if (self::$db->query("COMMIT")) {
                return 'success';
            } else {
                return 'failed';
            }
        } catch (\Exception $e) {
            // Si hay algún error, hacer rollback
            self::$db->query("ROLLBACK");
            return 'Error: ' . $e->getMessage();
        }
    }

    public static function guardar($atributos)
    {
        $query = " INSERT INTO " . static::$table . " ( ";
        $query .= join(', ', array_keys($atributos));
        $query .= " ) VALUES ('";
        $query .= join("', '", array_values($atributos));
        $query .= "') ";

        return self::$db->query($query);
    }

    public static function all_payments($año, $destacamento_id, $nombre, $page, $limit)
    {
        $query = "SELECT 
        e.id AS oficial_id,
        CONCAT(e.nombres, ' ', e.apellidos) AS nombre,
        d.id AS destacamento_id,
        d.nombre AS destacamento_nombre,
        COALESCE(
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'mes', MONTH(p.mes),
                        'fecha_pago', p.fecha_pago,
                        'monto', p.monto,
                        'responsable_id', p.responsable_id,
                        'solicitud_id', p.solicitud_id,
                        'año', YEAR(p.mes)
                    )
                )
                FROM pagos p
                WHERE p.oficial_id = e.id
                AND p.destacamento_id = d.id";

        if ($año !== null) {
            $query .= " AND YEAR(p.mes) = " . static::$db->escape_string($año);
        }

        $query .= "), '[]') AS meses_pagados
        FROM exploradores e
        JOIN destacamentos d ON e.destacamento_id = d.id";

        $whereConditions = [];

        if ($destacamento_id !== null) {
            $whereConditions[] = "e.destacamento_id = " . static::$db->escape_string($destacamento_id);
        }

        if ($nombre !== null) {
            $whereConditions[] = "(e.nombres LIKE '%" . static::$db->escape_string($nombre) . "%' OR e.apellidos LIKE '%" . static::$db->escape_string($nombre) . "%')";
        }

        if (!empty($whereConditions)) {
            $query .= " WHERE " . implode(" AND ", $whereConditions);
        }

        $query .= " ORDER BY e.apellidos, e.nombres";

        if ($limit !== null) {
            $offset = ($page - 1) * $limit;
            $query .= " LIMIT " . static::$db->escape_string($offset) . ", " . static::$db->escape_string($limit);
        }

        $result = static::$db->query($query);
        $pagos = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $row['meses_pagados'] = json_decode($row['meses_pagados'], true) ?? [];
                $pagos[] = $row;
            }
            return $pagos;
        } else {
            error_log('Error en SQL: ' . static::$db->error . "\nConsulta: " . $query);
            return ['error' => 'Error al obtener pagos', 'details' => static::$db->error];
        }
    }
}
