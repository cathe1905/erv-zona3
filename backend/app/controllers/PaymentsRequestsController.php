<?php

namespace Controllers;

use Model\PaymentsRequests;
use Model\RequestsHistory;

class PaymentsRequestsController
{

    public static function get_payments_requests()
    {
        try {
            $año = $_GET['año'] ?? null;

            if (!$año) {
                http_response_code(400);
                echo json_encode(['error' => 'El año es obligatorio']);
                return;
            }

            $estatus = isset($_GET['estatus']) && $_GET['estatus'] !== 'null' ? $_GET['estatus'] : null;
            $destacamento_id = isset($_GET['destacamento_id']) && $_GET['destacamento_id'] !== 'null' ? intval($_GET['destacamento_id']) : null;

            $mes = isset($_GET['mes']) && $_GET['mes'] !== 'null' ? $_GET['mes'] : null;
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

            $solicitudes = PaymentsRequests::all_paymets_requests($estatus, $destacamento_id, $año, $mes, $page, $limit);

            if (is_array($solicitudes)) {
                http_response_code(200);
                $response = [
                    'mensaje' => 'Consulta exitosa',
                    'solicitudes' => $solicitudes,
                ];
                echo json_encode($response);
            } else {
                http_response_code(400);
                $response = [
                    'mensaje' => 'Error al obtener las solicitudes. Intente nuevamente más tarde.',
                ];
                echo json_encode($response);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            error_log("Error al obtener las solicitudes " . $e->getMessage());
            echo json_encode([
                'error' => 'Ocurrió un error inesperado: ' . $e->getMessage(),
            ]);
        }
    }
    public static function create_payment_request()
    {
        newRecord(PaymentsRequests::class, 'solicitudes');
    }

    public static function edit_payment_request()
    {
        editRecord(PaymentsRequests::class, 'solicitudes');
    }

    public static function reject_request()
    {
        try{
            $jsonInput = file_get_contents('php://input');
            // Decodificar el JSON a un array asociativo
            $data = json_decode($jsonInput, true);
    
            $id_solicitud = $data['id'] ?? null;
            $comment = $data['comment'] ?? null;
            $id_user_admin = $data['id_user'] ?? null;
    
            if (!$id_solicitud || !$comment || !$id_user_admin) {
                http_response_code(400);
                echo json_encode(['error' => 'El id de la solicitud, id de usuario y el comentario son obligatorios']);
                return;
            }
    
            $solicitud = PaymentsRequests::find_field_record('solicitudes_pagos', 'id', $id_solicitud);
    
            if (!$solicitud) {
                http_response_code(400);
                echo json_encode(['error' => 'Solicitud no encontrada']);
                return;
            }
    
            $previous_status = $solicitud['estatus'];
    
            if ($previous_status !== 'pending') {
                http_response_code(400);
                echo json_encode(['error' => 'No se puede rechazar una solicitud con estatus: ' . $previous_status]);
                return;
            }
    
            //actualizamos el estado de la solcitud a 'rejected'
            $set_rejected_status = PaymentsRequests::edit_status('rejected', $id_solicitud);
    
            if ($set_rejected_status !== 'success') {
                http_response_code(400);
                echo json_encode(['error' => 'No se pudo completar el cambio de estatus a rejected']);
                return;
            }else{
                http_response_code(201);
                echo json_encode([ 'mensaje'=> 'La solicitud fue rechazada exitosamente.']);
               
            }
    
    
            try {
                //creamos la instancia para el registro de historial de solicitudes
                $history = new RequestsHistory([
                    "solicitud_id" => $id_solicitud,
                    "estatus_anterior" => $previous_status,
                    "estatus_nuevo" => 'rejected',
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
        }catch (\Exception $e) {
            http_response_code(500);
            error_log("Error al ejecutar el rechazo de pago" . $e->getMessage());
            echo json_encode([
                'error' => 'Ocurrió un error inesperado: ' . $e->getMessage(),
            ]);
        }
       
    }
}
