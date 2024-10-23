<?php
    namespace Model;

use function Controllers\debuguear;

    class ActiveRecord{

        // Base DE DATOS
        protected static $db;
        protected static $table = '';
        protected static $columnsDB = [];

        // Errores
        protected static $errors = [];

        protected $id; // Definición de la propiedad id
        protected $foto; // Definición de la propiedad foto
        
        // Definir la conexión a la BD
        public static function setDB($database) {
            self::$db = $database;
        }

        public static function allStatistics(){
            // se obtiene el conteo de los registros por tablas
            $query= "SELECT COUNT(*) AS total FROM " . static::$table;
            $result= static::$db->query($query);
            $statistic= $result->fetch_assoc();

            return $statistic;
        }
           // Identificar y unir los atributos de la BD
        public function atributos() {
            $atributos = [];
            foreach(static::$columnsDB as $columna) {
                if($columna === 'id') continue;
                $atributos[$columna] = $this->$columna;
            }
            return $atributos;
        }
        public function sanitizarAtributos() {
            $atributos = $this->atributos();
            $sanitizado = [];
            foreach($atributos as $key => $value ) {
                $sanitizado[$key] = self::$db->escape_string($value);
            }
            return $sanitizado;
        }

        public static function getErrores() {
            return static::$errors;
        }

        public function crear() {
            // Sanitizar los datos
            $atributos = $this->sanitizarAtributos();
    
            // Insertar en la base de datos
            $query = " INSERT INTO " . static::$table . " ( ";
            $query .= join(', ', array_keys($atributos));
            $query .= " ) VALUES ('"; 
            $query .= join("', '", array_values($atributos));
            $query .= " ') ";

            // Resultado de la consulta
            $resultado = self::$db->query($query);
            if($resultado){
                return ('se inserto correctamente');
                }else{
                return'Error en la ejecución de la consulta: ' . static::$db->error;
            }
        }
        public function actualizar() {
            // Sanitizar los datos
            $atributos = $this->sanitizarAtributos();
    
            $valores = [];
            foreach($atributos as $key => $value) {
                $valores[] = "{$key}='{$value}'";
            }
    
            $query = "UPDATE " . static::$table ." SET ";
            $query .=  join(', ', $valores );
            $query .= " WHERE id = '" . self::$db->escape_string($this->id) . "' ";
            $query .= " LIMIT 1 "; 
    
            $resultado = self::$db->query($query);
    
            return $resultado;
        }
        public function sincronizar($args=[]) { 
            foreach($args as $key => $value) {
              if(property_exists($this, $key) && !is_null($value)) {
                $this->$key = $value;
              }
            }
        }
        public static function find($id) {
            $query = "SELECT * FROM " . static::$table  ." WHERE id = " . $id ;
    
            $resultado = self::consultarSQL($query);
            return array_shift( $resultado ) ;
        }
        public static function consultarSQL($query) {
            // Consultar la base de datos
            $resultado = self::$db->query($query);
    
            // Iterar los resultados
            $array = [];
            while($registro = $resultado->fetch_assoc()) {
                $array[] = static::crearObjeto($registro);
            }
            // liberar la memoria
            $resultado->free();
    
            // retornar los resultados
            return $array;
        }
        protected static function crearObjeto($registro) {
            $objeto = new static;
    
            foreach($registro as $key => $value ) {
                if(property_exists( $objeto, $key  )) {
                    $objeto->$key = $value;
                }
            }
    
            return $objeto;
        }
            // Eliminar un registro
        public function eliminar() {
            $query = "DELETE FROM "  . static::$table . " WHERE id = " . self::$db->escape_string($this->id) . " LIMIT 1";
            $resultado = self::$db->query($query);

            return $resultado;
        }

        public static function all(){
            $query= "SELECT * FROM " . static::$table;
            $result= static::$db->query($query);
            $destacamentos= [];

            if($result){
                while($row= $result->fetch_assoc()){
                    $destacamentos[] = $row;
                }
            }else{
                echo 'Error en la ejecución de la consulta: ' . static::$db->error;
            }
            return $destacamentos;
        }
            // Subida de archivos
        public function setImagen($imagen, $imagen_antigua= null) {
            // Elimina la imagen previa
            if( !is_null($this->id) ) {
                $this->borrarImagen($imagen_antigua);
            }
            // Asignar al atributo de imagen el nombre de la imagen
            if($imagen) {
                $this->foto = $imagen;
            }
        }

        // Elimina el archivo
        public function borrarImagen($imagen) {
            // Comprobar si existe el archivo
            $existeArchivo = file_exists(CARPETA_IMAGENES . $imagen);
            if($existeArchivo) {
                unlink(CARPETA_IMAGENES . $imagen);
            }
        }

        public static function find_field_record($table, $column, $condition){
            $query = 'SELECT * FROM ' . $table . ' WHERE ' . $column . ' = "' . self::$db->escape_string($condition) . '" LIMIT 1';
            $request = self::$db->query($query);

            if ($request->num_rows > 0) {
                 $user= $request->fetch_assoc(); // Retorna los datos del registro
                
                 return $user;
            } else {
                return false; // Retorna falso si no encontró ningún registro
            }
            
            
        }


    }
?>