<?php


function dbConnection(): mysqli {
    // Detectar entorno y valores por defecto
    $environment = getenv('ENVIRONMENT') ?: 'local';

    // Configuraciones
    $config = [
        'local' => [
            'host' => 'localhost',
            'user' => 'root',
            'password' => '',
            'db_name' => 'erv_zona3'
        ],
        'domcloud' => [
            'host' => 'sao.domcloud.co',
            'user' => 'ervzona3',
            'password' => getenv('DATA_BASE'),
            'db_name' => 'ervzona3_db'
        ]
    ];

    $dbConfig = $config[$environment] ?? $config['local'];
    
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
