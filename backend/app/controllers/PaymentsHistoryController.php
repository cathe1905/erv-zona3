<?php
    namespace Controllers;

use Model\RequestsHistory;

    class PaymentsHistoryController {
        public static function get_history_by_id(){

            try{
                $solicitud_id = isset($_GET['solicitud_id']) && $_GET['solicitud_id'] !== 'null' ? intval($_GET['solicitud_id']) : null;

                $result= RequestsHistory::find_field_record('historial_solicitudes', 'solicitud_id', $solicitud_id);

                if($result){
                    $response = [
                        'mensaje' => 'Consulta exitosa',
                        'historial' => $result,
                    ];
                    echo json_encode($response);
                }else{
                    $response = [
                        'error' => 'No se encontraron resultados',
                    ];
                    echo json_encode($response);
                }

            }catch (\Exception $e) {
                http_response_code(500);
                error_log("Error al obtener el historial de solicitudes" . $e->getMessage());
                echo json_encode([
                    'error' => 'Ocurrió un error inesperado: ' . $e->getMessage(),
                ]);
            }

         
        }
    }
    