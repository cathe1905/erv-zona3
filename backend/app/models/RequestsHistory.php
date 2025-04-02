<?php

namespace Model;

class RequestsHistory extends ActiveRecord
{

    protected static $table = 'historial_solicitudes';
    protected static $columnsDB = ['id', 'solicitud_id', 'estatus_anterior', 'estatus_nuevo', 'usuario_id', 'comentario'];

    public $id;
    public $solicitud_id;
    public $estatus_anterior;
    public $estatus_nuevo;
    public $usuario_id;
    public $comentario;

    public function __construct($arg = [])
    {
        $this->id = $arg['id'] ?? null;
        $this->solicitud_id = $arg['solicitud_id'] ?? null;
        $this->estatus_anterior = $arg['estatus_anterior'] ?? null;
        $this->estatus_nuevo = $arg['estatus_nuevo'] ?? null;
        $this->usuario_id = $arg['usuario_id'] ?? null;
        $this->comentario = $arg['comentario'] ?? null;
    }

    public function validar()
    {

        // Validación de campos obligatorios
        if (!$this->solicitud_id) {
            self::$errors[] = "El campo solicitud_id es obligatorio";
        }

        if (!$this->estatus_anterior) {
            self::$errors[] = "El campo estatus_anterior es obligatorio";
        }

        if (!$this->estatus_nuevo) {
            self::$errors[] = "El campo estatus_nuevo es obligatorio";
        }

        if (!$this->usuario_id) {
            self::$errors[] = "El campo usuario_id es obligatorio";
        }

        return self::$errors;
    }

    public static function get_all($destacamento_id, $año, $mes, $page, $limit)
    {
 
        $inicio = ($limit * ($page - 1));

        $query = "SELECT historial_solicitudes.*, 
        usuarios.nombre AS usuario_nombre, usuarios.apellido AS usuario_apellido, destacamentos.id 
        AS destacamento_id, destacamentos.nombre AS destacamento_nombre 
        FROM historial_solicitudes 
        JOIN usuarios ON historial_solicitudes.usuario_id = usuarios.id 
        JOIN solicitudes_pagos ON historial_solicitudes.solicitud_id = solicitudes_pagos.id 
        JOIN destacamentos ON solicitudes_pagos.destacamento_id = destacamentos.id";

        if ($destacamento_id !== null) {
            $query .= " WHERE destacamentos.id =  '" . self::$db->escape_string($destacamento_id) . "'";
        }

        // evalua si solo existe la informacion de año
        if ($año != null) {
            if ($destacamento_id != null) {
                $query .= " AND YEAR(historial_solicitudes.fecha_cambio) = '"  . self::$db->escape_string($año) . "'";
            } else {
                $query .= " WHERE YEAR(historial_solicitudes.fecha_cambio) = '"  . self::$db->escape_string($año) . "'";
            }
        }
        //se añade directamente el mes como AND ya que obligatoriamente tiene que venir el año si filtras por mes(frontend)
        if($mes !== null){
            $query .= " AND MONTH(historial_solicitudes.fecha_cambio) = '"  . self::$db->escape_string($mes) . "'";
        }

        $query .= " LIMIT " . self::$db->escape_string($limit) . " OFFSET " . $inicio;

        $result = static::$db->query($query);
        $records = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
            return $records;
        } else {
            echo 'Error en la ejecución de la consulta: ' . static::$db->error;
        }
        
    }
}
