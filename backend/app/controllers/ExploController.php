<?php

namespace Controllers;

use Model\Explo;

class ExploController
{

  public static function getExploradores()
  {
    $destacamento = isset($_GET['destacamento']) && $_GET['destacamento'] !== 'null' ? intval($_GET['destacamento']) : null;
    $rama = isset($_GET['rama']) && $_GET['rama'] !== 'null' ? $_GET['rama'] : null;
    $query = isset($_GET['query']) && $_GET['query'] !== 'null' ? $_GET['query'] : null;
    $ascenso= isset($_GET['ascenso']) && $_GET['ascenso'] !== 'null' ? intval($_GET['ascenso']) : null;
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $all= false;

    $response = Explo::get_exploradores($destacamento, $rama, $ascenso, $query, $page, $limit, $all);
    $cuenta= Explo::get_exploradores_count($destacamento, $rama, $ascenso, $query);
    echo json_encode(['exploradores' => $response, 'total' => $cuenta]);
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