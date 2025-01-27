<?php
    
    require_once __DIR__ . '/../includes/funciones.php';
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../../vendor/autoload.php';
 

    $db= dbConnection();

    use Model\ActiveRecord;
    ActiveRecord::setDB($db) // hacer este método para agregar la base de datos a la clase principal.
?>