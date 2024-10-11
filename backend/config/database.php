<?php
    function dbConnection() : mysqli{

        //local connection
        $user= 'root';
        $password= '';
        $host= 'localhost';
        $db_name= 'erv_zona3';

    
        $db= new mysqli($host, $user, $password, $db_name);
        // Comprobando la conexión
        if ($db->connect_error) {
            die("Conexión fallida: " . $db->connect_error);
        } 
        // echo('db conectada');
        return $db;
}

?>