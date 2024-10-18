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

  public static function newExplorador()
  {
     // Verificar si se están enviando datos JSON en la solicitud
     $jsonInput = file_get_contents('php://input');
     // Decodificar el JSON a un array asociativo
     $data = json_decode($jsonInput, true);
 
     if (isset($data['explorador'])) {
         $explorador = new Explo($data['explorador']);
         $explorador->validar();
         $errores = Explo::getErrores();
         
         if (!empty($errores)) { 
             http_response_code(400); 
             $response = [
                 'errores' => $errores,
                 'mensaje' => 'No se pudo crear el explorador debido a errores en la entrada.',
             ];
             echo json_encode($response);
             return; 
         }
         // Intentar crear el recurso
         $result = $explorador->crear();
 
         if ($result) { 
             http_response_code(201); 
             $response = [
                 'mensaje' => 'Explorador creado exitosamente.',
                 'explorador' => $explorador,
             ];
             echo json_encode($response);
         } else { 
             http_response_code(500); 
             $response = [
                 'mensaje' => 'Error al crear el explorador. Intente nuevamente más tarde.',
             ];
             echo json_encode($response);
         }
     } else {
         http_response_code(400); 
         echo json_encode(['error' => 'Error: No se encontró el campo \'explorador\' en la solicitud.']);
     }
  }

  public static function editExplorador(){
    //aqui se devuelve al frontend el explorador para llenar el formulario
    if($_SERVER['REQUEST_METHOD'] === 'GET') {
        try{
            $id = $_GET['id'];
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if(!$id) {
                http_response_code(400); 
                echo json_encode(['error' => 'ID inválido']);
                return;
            }

            $explorador = Explo::find($id);

            if (!$explorador) {
                http_response_code(404); 
                echo json_encode(['error' => 'Explorador no encontrado']);
                return;
            }
            echo json_encode($explorador);
        }catch (\Exception $e){
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        
    } else{
        try{
        // se ejecuta código para método POST
       
            $jsonInput = file_get_contents('php://input');
            $data = json_decode($jsonInput, true); 
            
            // Cargar el post existente
            $postOriginal = Explo::find($data['explorador']['id']);

            if (!$postOriginal) {
                // Si el post no existe, manejar el error
                http_response_code(404);
                echo json_encode(['error' => 'Explorador no encontrado']);
                return;
            }

            $explorador= new Explo($data['explorador']);

            $errores= $explorador->validar();
            
            if (!empty($errores)) {
                http_response_code(400);
                echo json_encode(['errores' => $errores]);
                return;
            }
            
            // Guardar la nueva instancia en lugar de la original
            $result = $explorador->actualizar(); // O cualquier método que uses para guardar
            if ($result) {
                http_response_code(200);
                echo json_encode(['mensaje' => 'Explorador actualizado exitosamente']);
            } else {
                http_response_code(500);
                echo json_encode(['mensaje' => 'Error al actualizar el explorador.']);
            }
        
        }catch(\Exception $e){
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);

        }
    }
  }

  public static function deleteExplorador(){

    try{
        $jsonInput = file_get_contents('php://input');
        $data = json_decode($jsonInput, true);
        $id = filter_var($data['id'], FILTER_VALIDATE_INT); 
        
        if(!$id) {
            http_response_code(400); 
            echo json_encode(['error' => 'ID no encontrado']);
            return;
        }

        $explorador = Explo::find($id);
        $resultado = $explorador->eliminar();

        if ($resultado) {
            http_response_code(200);
            echo json_encode(['mensaje' => 'Explorador eliminado exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Error al eliminado el explorador.']);
        }

    }catch (\Exception $e){
        http_response_code($e->getCode() ?: 500);
        echo json_encode(['error' => $e->getMessage()]);

    }
   
  }
}