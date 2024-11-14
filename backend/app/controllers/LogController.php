<?php
        namespace Controllers;
        use Model\Log;

        class LogController {
            public static function get_logs(){
                $logs= Log::all();
                echo json_encode($logs);
            }
            public static function save_log(){
                newRecord(Log::class, 'log');
            }

           
        }
?>