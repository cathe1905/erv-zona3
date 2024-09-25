<?php
    namespace Model;

    class ActiveRecord{

        // Base DE DATOS
        protected static $db;
        protected static $table = '';
        protected static $columnsDB = [];

        // Errores
        protected static $errors = [];
        
        // Definir la conexión a la BD
        public static function setDB($database) {
            self::$db = $database;
        }

        public static function allStatistics(){
            $query= "SELECT COUNT(*) AS total FROM " . static::$table;
            $result= static::$db->query($query);
            $statistic= $result->fetch_assoc();
            return $statistic;
        }

        // public static function all(){
        //     $query= "SELECT * FROM " . static::$table;
        //     $result= static::$db->query($query);
        //     $records= [];

        //     if($result){
        //         while($row= $result->fetch_assoc()){
        //             // $records[] = 
        //         }
        //     }else{
        //         echo 'Error en la ejecución de la consulta: ' . static::$db->error;
        //     }
        // }

    }
?>