<?php
        namespace Controllers;
        use Model\Log;

        class LogController {
            public static function get_logs(){
                $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
                $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

                $logs= Log::allLogs($page, $limit);
                $cuenta= Log::get_logs_count();
                echo json_encode(['logs' => $logs, 'total' => $cuenta]);
            }
            public static function save_log(){
                newRecord(Log::class, 'log');
            }

           
        }
?>