<?php
    require 'config/database.php';
    require __DIR__ . '/../vendor/autoload.php';
    require 'includes/funciones.php';

    $db= dbConnection();

    use Model\ActiveRecord;
    ActiveRecord::setDB($db) // hacer este método para agregar la base de datos a la clase principal.
?>