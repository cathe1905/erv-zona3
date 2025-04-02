<?php
require_once __DIR__ . '/backend/includes/funciones.php';
use function Controllers\loadEnv;
loadEnv(__DIR__ . '/.env');
header('Content-Type: application/json; charset=UTF-8');

// Rutas excluidas (accesibles desde cualquier origen)
$excludedEndpoints = [
    '/backend/users/verification',
    '/backend/users/verification-token-reset'
];

// Obtener la ruta solicitada
$requestUri = $_SERVER['REQUEST_URI'];

// Verificar si la ruta solicitada incluye alguno de los endpoints exentos
$isExcluded = false;
foreach ($excludedEndpoints as $endpoint) {
    if (strpos($requestUri, $endpoint) !== false) {
        $isExcluded = true;
        break;
    }
}

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if ($isExcluded) {
        // Permitir cualquier origen para endpoints excluidos
        header("Access-Control-Allow-Origin: *");
    } else {
        // Restringir a tu dominio frontend para las demás rutas
        header("Access-Control-Allow-Origin: " . getenv('URL_FRONTEND'));
    }
    header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(204);
    exit;
}

// Aplicar lógica de CORS basada en si el endpoint está exento o no
if ($isExcluded) {
    // Permitir cualquier origen para estos endpoints
 header("Access-Control-Allow-Origin: *");
} else {
    // Restringir el acceso solo a tu dominio frontend
    $allowedOrigin = getenv('URL_FRONTEND');
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        $origin = $_SERVER['HTTP_ORIGIN'];
        if ($origin === $allowedOrigin) {
            header("Access-Control-Allow-Origin: $origin");
        } else {
            http_response_code(403);
            echo json_encode(['error' => 'Acceso denegado: Origen no permitido']);
            exit;
        }
    } else {
        http_response_code(403);
        echo json_encode(['error' => 'Acceso denegado: Origen no especificado']);
        exit;
    }
}


// Cabeceras comunes para todas las respuestas
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require_once __DIR__ . '/backend/app/app.php';

use MVC\Router;
use Controllers\DetachmentController;
use Controllers\ExploController;
use Controllers\LeadershipController;
use Controllers\ExcelController;
use Controllers\RankController;
use Controllers\StatisticsController;
use Controllers\UserController;
use Controllers\LogController;
use Controllers\PaymentsRequestsController;
use Controllers\PaymentsController;
use Controllers\PaymentsHistoryController;

$router= new Router();

$router->get('/', [StatisticsController::class, 'getStatistics']);

$router->get('/backend/explo', [ExploController::class, 'getExploradores']);
$router->post('/backend/explo', [ExploController::class, 'newExplorador']);
$router->post('/backend/explo/actualizar', [ExploController::class, 'editExplorador']);
$router->get('/backend/explo/actualizar', [ExploController::class, 'editExplorador']);
$router->post('/backend/explo/eliminar', [ExploController::class, 'deleteExplorador']);

$router->get('/backend/destacamentos', [DetachmentController::class, 'getDestacamentos']);
$router->post('/backend/destacamentos', [DetachmentController::class, 'newDestacamento']);
$router->get('/backend/destacamentos/actualizar', [DetachmentController::class, 'editDestacamento']);
$router->post('/backend/destacamentos/actualizar', [DetachmentController::class, 'editDestacamento']);
$router->post('/backend/destacamentos/eliminar', [DetachmentController::class, 'deleteDestacamento']);

$router->get('/backend/directiva', [LeadershipController::class, 'getLeadership']);
$router->post('/backend/directiva', [LeadershipController::class, 'newLeadership']);
$router->get('/backend/directiva/actualizar', [LeadershipController::class, 'editLeadership']);
$router->post('/backend/directiva/actualizar', [LeadershipController::class, 'editLeadership']);
$router->post('/backend/directiva/eliminar', [LeadershipController::class, 'deleteLeadership']);

$router->get('/backend/ascensos', [RankController::class, 'getAscensos']);
$router->post('/backend/ascensos', [RankController::class, 'newAscenso']);
$router->get('/backend/ascensos/actualizar', [RankController::class, 'editAscenso']);
$router->post('/backend/ascensos/actualizar', [RankController::class, 'editAscenso']);
$router->post('/backend/ascensos/eliminar', [RankController::class, 'deleteAscenso']);

$router->get('/backend/users', [UserController::class, 'getUsers']);
$router->post('/backend/users', [UserController::class, 'newUser']);
$router->get('/backend/users/verification', [UserController::class, 'verificationUser']);
$router->get('/backend/users/actualizar', [UserController::class, 'editUser']);
$router->post('/backend/users/actualizar', [UserController::class, 'editUser']);
$router->post('/backend/users/eliminar', [UserController::class, 'deleteUser']);
$router->post('/backend/users/auth', [UserController::class, 'authUser']);
$router->post('/backend/users/refresh', [UserController::class, 'refreshToken']);
$router->get('/backend/user/email', [UserController::class, 'getUserEmail']); 
$router->get('/backend/user/solicitud-recuperacion-contrasena', [UserController::class, 'recoverPassword']);
$router->get('/backend/users/verification-token-reset', [UserController::class, 'verificationTokenRecoverPassword']);
$router->get('/backend/user/is-token-valid', [UserController::class, 'isTokenValid']); 
$router->post('/backend/password-reset', [UserController::class, 'passwordReset']);

$router->get('/backend/excel', [ExcelController::class, 'descargarExcel']);

$router->get('/backend/logs', [LogController::class, 'get_logs']);
$router->post('/backend/logs', [LogController::class, 'save_log']);

$router->get('/backend/solicitud_pagos', [PaymentsRequestsController::class, 'get_payments_requests']);
$router->post('/backend/solicitud_pagos', [PaymentsRequestsController::class, 'create_payment_request']);
$router->get('/backend/solicitud_pagos/actualizar', [PaymentsRequestsController::class, 'edit_payment_request']);
$router->post('/backend/solicitud_pagos/actualizar', [PaymentsRequestsController::class, 'edit_payment_request']);
$router->post('/backend/rechazar-solicitud', [PaymentsRequestsController::class, 'reject_request']);

$router->get('/backend/pagos', [PaymentsController::class, 'get_payments']);
$router->post('/backend/aprobar-pagos', [PaymentsController::class, 'set_payments']);

$router->get('/backend/historial-solicitudes', [PaymentsHistoryController::class, 'get_all_history']);



$router->comprobarRutas();


?>