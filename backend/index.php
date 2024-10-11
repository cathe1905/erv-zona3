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
// $router->get('/backend/explo?destacamento=', [ExploController::class, 'getExploradores']);


$router->comprobarRutas();


?>