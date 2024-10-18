<?php
// header('Access-Control-Allow-Origin: *');
// header('Content-Type: application/json');
// header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
// header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once __DIR__ . '/app/app.php';

use MVC\Router;
use Controllers\DetachmentController;
use Controllers\ExploController;
use Controllers\LeadershipController;
use Controllers\LoginController;
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



$router->comprobarRutas();


?>