<?php
    function dbConnection() : mysqli{

        // Detectamos el entorno usando una variable de entorno 'ENVIRONMENT'
    $environment = getenv('ENVIRONMENT') ?: 'local'; // Si no está definida, asumimos que es local

    // Variables para local
    $local_host = 'localhost';
    $local_user = 'root';
    $local_password = '';
    $local_db_name = 'erv_zona3';
    
    $host= '';
    $user='';
    $password='';
    $db_name='';

    // Variables para Heroku (usando JAWSDB_URL)
    if (getenv('JAWSDB_URL')) {
        $url = parse_url(getenv('JAWSDB_URL'));
        $host = $url['host'];
        $port = $url['port'];
        $user = $url['user'];
        $password = $url['pass'];
        $db_name = ltrim($url['path'], '/');
    } else {
        // Condiciones según el entorno
        if ($environment === 'heroku') {
            // Usar configuración de Heroku
            $host = $host;
            $user = $user;
            $password = $password;
            $db_name = $db_name;
        } else {
            // Conexión local
            $host = $local_host;
            $user = $local_user;
            $password = $local_password;
            $db_name = $local_db_name;
        }
    }

    // Conexión a la base de datos
    $db = new mysqli($host, $user, $password, $db_name, $port ?? 3306);  // Usar puerto por defecto si no se especifica
    $db->set_charset("utf8mb4");
    // echo('db conectada');
    return $db;
}

?>