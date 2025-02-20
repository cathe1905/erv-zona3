<?php

namespace Model;

use function Controllers\debuguear;

class User extends ActiveRecord
{
    // Base DE DATOS
    protected static $table = 'usuarios';
    protected static $columnsDB = ['id', 'nombre', 'apellido', 'email','contraseña', 'token', 'verificado', 'destacamento_id', 'rol', 'reset_password_token', 'reset_password_expires'];

    public $id;
    public $nombre;
    public $apellido;
    public $email;
    public $contraseña;
    public $destacamento_id;
    public $rol;
    public $token;
    public $verificado;
    public $reset_password_token;
    public $reset_password_expires;

    public function __construct($arg = [])
    {
        $this->id = $arg['id'] ?? null;
        $this->nombre = $arg['nombre'] ?? '';
        $this->apellido = $arg['apellido'] ?? '';
        $this->email = $arg['email'] ?? '';
        $this->contraseña = $arg['contraseña'] ?? '';
        $this->destacamento_id = $arg['destacamento_id'] ?? '';
        $this->rol = $arg['rol'] ?? '';
        $this->token = $arg['token'] ?? '';
        $this->verificado = $arg['verificado'] ?? 0;
        $this->reset_password_token = $arg['reset_password_token'] ?? '';
        $this->reset_password_expires = $arg['reset_password_expires'] ?? null;
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
        
        if (!$this->nombre) {
            self::$errors[] = 'El campo nombre es obligatorio';
        }
        if (!$this->apellido) {
            self::$errors[] = 'El campo apellido es obligatorio';
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
        $query =  "SELECT usuarios.id, usuarios.nombre, usuarios.apellido, usuarios.email, destacamentos.nombre AS destacamento, CASE
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

    public static function datos_auth($email){
        $query = 'SELECT usuarios.*, destacamentos.nombre AS destacamento, destacamentos.id AS destacamento_id
          FROM usuarios 
          INNER JOIN destacamentos ON usuarios.destacamento_id = destacamentos.id
          WHERE usuarios.email = "' . self::$db->escape_string($email) . '" 
          AND usuarios.verificado = 1';

        $result= static::$db->query($query);
        if ($result) {
            $user = $result->fetch_assoc();
            return $user;

        } else {
            return null;
        }
    }

    public static function sanitizarUpdate($atributos){
        $sanitizado = [];
        foreach($atributos as $key => $value ) {
            if($key=== 'id') continue;
            $sanitizado[$key] = self::$db->escape_string($value);
        }
        return $sanitizado;
    }

    public static function update($campos) {
        // Sanitizar los datos
        $atributos = self::sanitizarUpdate($campos);
        $id= $campos['id'];
        $valores = [];
        foreach($atributos as $key => $value) {
            $valores[] = "{$key} = '{$value}'";
        }

        $query = "UPDATE " . static::$table ." SET ";
        $query .=  join(', ', $valores );
        $query .= " WHERE id = '" . self::$db->escape_string($id) . "' ";
        $query .= " LIMIT 1"; 

        $resultado = self::$db->query($query);

        return $resultado;
    }

    public static function find_by_email($email) {
        $query = "SELECT * FROM " . static::$table . " WHERE email = '" . self::$db->escape_string($email) . "'";
        $resultado = self::$db->query($query);
        return $resultado->fetch_assoc();
    }

    
}
