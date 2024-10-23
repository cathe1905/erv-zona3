<?php

namespace Controllers;

use Model\Explo;

class ExploController
{

  public static function getExploradores()
  {
    $destacamento = isset($_GET['destacamento']) ? $_GET['destacamento'] : null;
    $rama = isset($_GET['rama']) ? $_GET['rama'] : null;
    $query = isset($_GET['query']) && $_GET['query'] !== '' ? $_GET['query'] : '';
    $ascenso= isset($_GET['ascenso']) ? $_GET['ascenso'] : null;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 25;

    $response = Explo::get_exploradores($destacamento, $rama, $ascenso, $query, $limit);
    echo json_encode($response);
  }

  //las funciones que se usan a continuación estan el archivo funciones.php
  public static function newExplorador()
  {
    newRecord(Explo::class, 'explorador');
  }

  public static function editExplorador(){
    editRecord(Explo::class, 'explorador');
  }

  public static function deleteExplorador(){

    deleteRecord(Explo::class, 'explorador');
   
  }
}