<?php

function dbConnection(): mysqli {
    // Configuración de producción
    $dbConfig = [
        'host' => 'sao.domcloud.co',
        'user' => 'exploradoresz3',
        'password' => getenv('DATA_BASE'), // Obtiene la contraseña del archivo .env
        'db_name' => 'exploradoresz3_db'
    ];

    // Conexión a la base de datos
    $db = new mysqli(
        $dbConfig['host'],
        $dbConfig['user'],
        $dbConfig['password'],
        $dbConfig['db_name'],
        3306
    );

    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }

    $db->set_charset("utf8mb4");
    return $db;
}

?>