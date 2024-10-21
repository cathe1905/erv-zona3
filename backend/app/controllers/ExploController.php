<?php

namespace Controllers;

use Model\Explo;

class ExploController
{

  public static function getExploradores()
  {
    $destacamento = isset($_GET['destacamento']) ? $_GET['destacamento'] : null;
    $rama = isset($_GET['rama']) ? $_GET['rama'] : null;
    $id = isset($_GET['id']) ? intval($_GET['id']) : null;
    $query = isset($_GET['query']) && $_GET['query'] !== '' ? $_GET['query'] : '';
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

    $response = Explo::get_exploradores($destacamento, $rama, $id, $query, $page, $limit);
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