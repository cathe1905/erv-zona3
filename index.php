<?php

header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header("Access-Control-Allow-Headers: Content-Type, Authorization");


require_once __DIR__ . '/backend/app/app.php';
// Cargar el archivo .env
use Dotenv\Dotenv;

// Acceder a las variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

use MVC\Router;
use Controllers\DetachmentController;
use Controllers\ExploController;
use Controllers\LeadershipController;
use Controllers\ExcelController;
use Controllers\RankController;
use Controllers\StatisticsController;
use Controllers\UserController;
use Controllers\LogController;

$router= new Router();

$router->get('/backend/', [StatisticsController::class, 'getStatistics']);

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
$router->post('/backend/password-reset/request', [UserController::class, 'passwordReset']);

$router->get('/backend/excel', [ExcelController::class, 'descargarExcel']);

$router->get('/backend/logs', [LogController::class, 'get_logs']);
$router->post('/backend/logs', [LogController::class, 'save_log']);

$router->comprobarRutas();


?>