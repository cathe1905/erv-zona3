<?php

namespace Model;

use function Controllers\debuguear;

class User extends ActiveRecord
{
    // Base DE DATOS
    protected static $table = 'usuarios';
    protected static $columnsDB = ['id', 'email', 'contraseña', 'token', 'verificado', 'destacamento_id', 'rol'];

    public $id;
    public $email;
    public $contraseña;
    public $destacamento_id;
    public $rol;
    public $token;
    public $verificado;

    public function __construct($arg = [])
    {
        $this->id = $arg['id'] ?? null;
        $this->email = $arg['email'] ?? '';
        $this->contraseña = $arg['contraseña'] ?? '';
        $this->destacamento_id = $arg['destacamento_id'] ?? '';
        $this->rol = $arg['rol'] ?? '';
        $this->token = $arg['token'] ?? '';
        $this->verificado = $arg['verificado'] ?? 0;
    }

    public function validar()
    {
        // El backend valida que los campos obligatorios no estén vacíos.
        if (!$this->email) {
            self::$errors[] = "El campo email es obligatorio";
        }
        if($this->id === null){
            if($this-> find_field_record(self::$table, 'email', $this->email)){
                self::$errors[] = "Este email ya esta registrado";
            }
        }
        
        if (!$this->contraseña) {
            self::$errors[] = 'El campo contraseña es obligatorio';
        }

        if (!$this->destacamento_id) {
            self::$errors[] = 'El campo destacamento_id es obligatorio';
        }

        if (!$this->rol) {
            self::$errors[] = 'El campo rol es obligatorio';
        }

        return self::$errors;
    }

    public static function all()
    {
        $query =  "SELECT usuarios.id, usuarios.email, destacamentos.nombre AS destacamento, CASE
            WHEN rol = 1 THEN 'Administrador'
            WHEN rol= 2 THEN 'Usuario'
            ELSE 'No clasificado'
            END AS rol
            FROM usuarios INNER JOIN destacamentos ON usuarios.destacamento_id = destacamentos.id";

        $result = static::$db->query($query);

        $users = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
        } else {
            echo 'Error en la ejecución de la consulta: ' . static::$db->error;
        }

        return $users;
    }

    

    
}
