<?php
    namespace Controllers;

    class ExploController{
        
        public static function getExploradores(){
            $response = [
                'message' => 'Hello, this is a JSON response getExploradores'
            ];
            echo json_encode($response);
        }
    }
?>