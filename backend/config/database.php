<?php

function dbConnection(): mysqli
{
    $environment = getenv('APP_ENV'); 

    $dbConfig = [
        'host' => '',
        'user' => '',
        'password' => '',
        'db_name' => ''
    ];

    if ($environment === 'production') {
        $dbConfig['host'] = 'sao.domcloud.co';
        $dbConfig['user'] = 'exploradoresz3';
        $dbConfig['password'] = getenv('DATA_BASE');
        $dbConfig['db_name'] = 'exploradoresz3_db';

    } elseif ($environment === 'development') {
        $dbConfig['host'] = 'sao.domcloud.co';
        $dbConfig['user'] = 'ervzona3';
        $dbConfig['password'] = getenv('DATA_BASE');
        $dbConfig['db_name'] = 'ervzona3_db';

    } else { // local
        $dbConfig['host'] = 'localhost';
        $dbConfig['user'] = 'root';
        $dbConfig['password'] = '';
        $dbConfig['db_name'] = 'erv_zona3';
    }

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


