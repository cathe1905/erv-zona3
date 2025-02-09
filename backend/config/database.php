<?php
function dbConnection(): mysqli {
    // Detectamos el entorno usando una variable de entorno 'ENVIRONMENT'
    $environment = getenv('ENVIRONMENT') ?: 'local'; // Si no está definida, asumimos que es local

    // Variables para local
    $local_host = 'localhost';
    $local_user = 'root';
    $local_password = '';
    $local_db_name = 'erv_zona3';

    // Variables para DomCloud
    $domcloud_host = 'sao.domcloud.co';  // Cambiar al host proporcionado por DomCloud
    $domcloud_user = 'ervzona3';
    $domcloud_password = getenv('DATA_BASE');
    $domcloud_db_name = 'ervzona3_db';

    $host = '';
    $user = '';
    $password = '';
    $db_name = '';
    $port = 3306;

    // Configurar conexión según el entorno
    if ($environment === 'domcloud') {
        $host = $domcloud_host;
        $user = $domcloud_user;
        $password = $domcloud_password;
        $db_name = $domcloud_db_name;
    } else {
        // Conexión local
        $host = $local_host;
        $user = $local_user;
        $password = $local_password;
        $db_name = $local_db_name;
    }

    // Conexión a la base de datos
    $db = new mysqli($host, $user, $password, $db_name, $port);

    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }

    $db->set_charset("utf8mb4");
    return $db;
}
?>
