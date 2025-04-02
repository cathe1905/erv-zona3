<?php

namespace Controllers;

use Model\Payments;
use Model\PaymentsRequests;
use Model\RequestsHistory;

class PaymentsController
{

    public static function get_payments(){
        try{
            $año = isset($_GET['año']) && $_GET['año'] !== 'null' ? intval($_GET['año']) : date('Y');
            $destacamento_id = isset($_GET['destacamento_id']) && $_GET['destacamento_id'] !== 'null' ? intval($_GET['destacamento_id']) : null;
            $nombre = isset($_GET['nombre']) && $_GET['nombre'] !== 'null' ? $_GET['nombre'] : null;
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

            echo json_encode(Payments::all_payments($año, $destacamento_id, $nombre, $page, $limit));
        }catch (\Exception $e) {
            http_response_code(500);
            error_log("Error al ejecutar el registro de pagos" . $e->getMessage());
            echo json_encode([
                'error' => 'Ocurrió un error inesperado: ' . $e->getMessage(),
            ]);
        }
    }

    public static function set_payments()
    {

        try {

            $jsonInput = file_get_contents('php://input');
            // Decodificar el JSON a un array asociativo
            $data = json_decode($jsonInput, true);

            //obtenemos los datos que necesitamos para procesar los pagos y guardar el histórico.
            $id_solicitud = $data['id_solicitud'] ?? null;
            $id_user_admin = $data['id_user'] ?? null;
            $comment = $data['comment'];


            if (!$id_solicitud || !$id_user_admin) {
                http_response_code(400);
                echo json_encode(['error' => 'El id de la solicitud y el id del usuario es obligatorio']);
                return;
            }
            //solicitud a procesar
            $solicitud = Payments::find_field_record('solicitudes_pagos', 'id', $id_solicitud);

            //guardarmos el estatus anterior para el registro en el historial
            $previous_status = $solicitud['estatus'];

            if (!$solicitud) {
                http_response_code(400);
                echo json_encode(['error' => 'Solicitud no encontrada']);
                return;
            }

            if ($solicitud['estatus'] === 'approved' || $solicitud['estatus'] === 'rejected') {
                http_response_code(400);
                echo json_encode(['error' => 'No se puede procesar una solicitud con estado: aprobada o rechazada']);
                return;
            }

                //actualizamos el estado de la solcitud a processing
                $set_processing_status= PaymentsRequests::edit_status('processing', $id_solicitud);

                if($set_processing_status !== 'success'){
                    http_response_code(400);
                    echo json_encode(['error' => 'No se puede cambiar el estado a: processing']);
                    return;
                }

                //se decodifica la columna que trae los id de los oficiales y los meses ya que en DB estan como json
                $decoded_json_solicitud = json_decode($solicitud['relaciones_oficiales_meses'], true);
                $today_date = date("Y/m/d");

                $pagos_instancias = [];
                $errors= [];

                //se hace un mapeo de todos los pagos con una instancia de la clase guardado en pagos instancias, al mismo tiempo
                //se valida que haya errores en los campos.
                foreach ($decoded_json_solicitud as $id => $meses) {
                    foreach ($meses as $date) {
                        $pago = new Payments(
                            [
                                'oficial_id' => $id,
                                'mes' => $date,
                                'monto' => $solicitud['monto'],
                                'responsable_id' => $solicitud['responsable_id'],
                                'fecha_pago' => $today_date,
                                'solicitud_id' => $solicitud['id'],
                                'destacamento_id' => $solicitud['destacamento_id']
                            ]

                        );
                        $error= $pago->validar();
                        if($error){
                            $errors[] = $error;
                        }

                        $pagos_instancias[] = $pago;
                    }
                }
                //ocurrió algun error con las entradas
                if(count($errors) > 1) {
                    http_response_code(400);
                    echo json_encode([ 'error'=> 'No es posible continuar debido a errores en las entradas', 'error' => $errors]);
                    return;
                }

                //procesar los pagos uno a uno, mes por mes.
               $result= Payments::crear_pago($pagos_instancias);

               if($result !== 'success'){
                http_response_code(400);
                echo json_encode([ 'error'=> 'Uno o mas pagos no pudieron se procesados, todo el proceso falló. Reintentar mas tarde']);
                return;
               }

                //actualizamos el estado de la solcitud a approved
               $set_approved_status= PaymentsRequests::edit_status('approved', $id_solicitud);

               if($set_approved_status === 'success'){
                http_response_code(201);
                echo json_encode([ 'mensaje'=> 'Todos los pagos fueron registrados exitosamente.']);
               }else{
                http_response_code(201);
                echo json_encode([ 'mensaje'=> 'Todos los pagos fueron registrados exitosamente, pero no se pudo cambiar el estado de la solicitud. Contacte soporte.']);
               }

            try {
                //creamos la instancia para el registro de historial de solicitudes
                $history = new RequestsHistory([
                    "solicitud_id" => $id_solicitud,
                    "estatus_anterior" => $previous_status,
                    "estatus_nuevo" => 'approved',
                    "usuario_id" => $id_user_admin,
                    "comentario" => $comment
                ]);

                //validar errores
                $history_errors = $history->validar();

                if (count($history_errors) > 1) {
                    error_log("Hubo errores en los datos de la instancia de historial de solicitudes: " . $history_errors[0]);
                    return;
                }

                $result= $history->crear();

                if($result !== 'success'){
                    error_log($result);
                }


            } catch (\Exception $e) {
                error_log("Error al ejecutar el registro de pagos" . $e->getMessage());
            }
        } catch (\Exception $e) {
            http_response_code(500);
            error_log("Error al ejecutar el registro de pagos" . $e->getMessage());
            echo json_encode([
                'error' => 'Ocurrió un error inesperado: ' . $e->getMessage(),
            ]);
        }
    }

    
}
