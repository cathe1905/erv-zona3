<?php
    namespace Controllers;

use Model\RequestsHistory;

    class PaymentsHistoryController {
        public static function get_all_history(){

            try{
                $destacamento_id = isset($_GET['destacamento_id']) && $_GET['destacamento_id'] !== 'null' ? intval($_GET['destacamento_id']) : null;
                $año = isset($_GET['año']) && $_GET['año'] !== 'null' ? intval($_GET['año']) : null;
                $mes = isset($_GET['mes']) && $_GET['mes'] !== 'null' ? intval($_GET['mes']) : null;
                $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
                $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

                $result= RequestsHistory::get_all($destacamento_id, $año, $mes, $page, $limit);

                if(is_array($result)){
                    $response = [
                        'mensaje' => 'Consulta exitosa',
                        'solicitudes' => $result,
                    ];
                    echo json_encode($response);
                }else{
                    $response = [
                        'mensaje' => 'Error al obtener los historiales. Intente nuevamente más tarde.',
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
    