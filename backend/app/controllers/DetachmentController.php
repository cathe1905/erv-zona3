<?php

namespace Controllers;

use Model\Detachment;

class DetachmentController
{

    public static function getDestacamentos()
    {
        $destacamentos = Detachment::all();
        echo json_encode($destacamentos);
    }
    
     //las funciones que se usan a continuación estan el archivo funciones.php
    public static function newDestacamento()
    {
        newRecord(Detachment::class, 'destacamento');
    }

    public static function editDestacamento()
    {
        editRecord(Detachment::class, 'destacamento');
    }

    public static function deleteDestacamento(){

        deleteRecord(Detachment::class, 'destacamento');
    }
}
