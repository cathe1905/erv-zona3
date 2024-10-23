<?php

header('Content-Type: application/json; charset=UTF-8');
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
// header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once __DIR__ . '/app/app.php';

use MVC\Router;
use Controllers\DetachmentController;
use Controllers\ExploController;
use Controllers\LeadershipController;
use Controllers\ExcelController;
use Controllers\PagesController;
use Controllers\RankController;
use Controllers\StatisticsController;
use Controllers\UserController;

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

$router->get('/backend/excel', [ExcelController::class, 'descargarExcel']);

$router->comprobarRutas();


?>