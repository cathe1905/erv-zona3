<?php
namespace MVC;

use function Controllers\debuguear;

    class Router {
        public $getRoutes= [];
        public $postRoutes= [];

        // estas funciones agregan la ruta al array asociativo asignandoles la funcion correspondiente
        public function get($url, $fn){
            $this->getRoutes[$url] = $fn;
        }
        public function post($url, $fn){
            $this->postRoutes[$url] = $fn;
        }

        // en esta se comprueba si existe la ruta en nuestros arrays y manda a llamar la funcion asociada
        public function comprobarRutas() {
            //este parse_url es una funcion que tomaa solo el path de la ruta sin los parámetros, de esta forma funcionan las rutas asi tengan parámetros.
            $current_url = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/backend');
            $method= $_SERVER['REQUEST_METHOD'];

            // debuguear($this->postRoutes);
            if($method === 'GET'){
                $fn= $this->getRoutes[$current_url] ?? null;
            } elseif($method === 'POST'){
                $fn= $this->postRoutes[$current_url] ?? null;
            }
            // los paramaetros significan $fn: la funcion y $this: los parametros de $fn (aun no se bien como se ve en acción)
            if($fn){
                call_user_func($fn, $this);
            }else{
                echo json_encode(['error' => 'Pagina no encontrada', 'url' => $current_url, 'method' => $method]);
            }
            
        }
        
    }
?>