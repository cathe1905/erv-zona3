<?php

namespace Model;

use function Controllers\debuguear;

class Log extends ActiveRecord
{

    public static $table = 'admin_log';
    public static $columnsDB = ['id', 'admin_id', 'action', 'target_id', 'details', 'date'];

    public $id;
    public $admin_id;
    public $action;
    public $target_id;
    public $details;
    public $date;

    public function __construct($arg = [])
    {
        $this->id = $arg['id'] ?? null;
        $this->admin_id = $arg['admin_id'] ?? '';
        $this->action = $arg['action'] ?? '';
        $this->target_id = $arg['target_id'] ?? '';
        $this->details = $arg['details'] ?? '';
        $this->date = date('Y-m-d H:i:s');
    }

    public function validar()
    {
        if (!$this->admin_id) {
            self::$errors[] = "El campo admin_id es obligatorio";
        }

        if (!$this->action) {
            self::$errors[] = "El campo action es obligatorio";
        }

        if (!$this->target_id) {
            self::$errors[] = "El campo target_id es obligatorio";
        }

        if (!$this->details) {
            self::$errors[] = "El campo details es obligatorio";
        }

        return self::$errors;
    }

    public static function allLogs($page, $limit)
    {
        $inicio = ($limit * ($page - 1));

        $query = "SELECT admin_log.id,
        admin_log.action,
        admin_log.details,
        admin_log.date,
        admin_users.nombre AS admin_nombre,
        admin_users.apellido AS admin_apellido,
        target_users.nombre AS target_nombre,
        target_users.apellido AS target_apellido
        FROM admin_log
        LEFT JOIN usuarios AS admin_users ON admin_log.admin_id = admin_users.id
        LEFT JOIN usuarios AS target_users ON admin_log.target_id = target_users.id ORDER BY admin_log.date DESC";

        $query .= " LIMIT " . self::$db->escape_string($limit) . " OFFSET " . self::$db->escape_string($inicio);
        $result = static::$db->query($query);
        $destacamentos = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $destacamentos[] = $row;
            }
        } else {
            echo 'Error en la ejecución de la consulta: ' . static::$db->error;
        }
        return $destacamentos;
    }

    public static function get_logs_count(){
        $query= "SELECT COUNT(*) AS total from admin_log";
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
