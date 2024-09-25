<?php
namespace MVC;

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
            $current_url = $_SERVER['REQUEST_URI'] ?? '/backend/';
            $method= $_SERVER['REQUEST_METHOD'];

            if($method === 'GET'){
                $fn= $this->getRoutes[$current_url] ?? null;
            } elseif($method === 'POST'){
                $fn= $this->postRoutes[$current_url] ?? null;
            }
            // los paramaetros significan $fn: la funcion y $this: los parametros de $fn (aun no se bien como se ve en acción)
            if($fn){
                call_user_func($fn, $this);
            }else{
                echo json_encode(['error' => 'Pagina no encontrada']);
            }
            
        }
        
    }
?>