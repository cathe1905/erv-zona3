<?php
    namespace Controllers;

    //importo los modelos que usaré
    use Model\Statistics;
    use Model\ZonalLeadership;

    class StatisticsController{

        public static function getStatistics(){

            // llamo los métodos allStatistics en cada modelo segun su tabla(exploradores o directiva zonal)
            //llamo el método de estadísticas por rama, creada en el modelo de estadística.
            $general_statistic= Statistics::allStatistics();
            $statistics_ramas= Statistics::getStatisticsByRama();
            $statistics_zonal= ZonalLeadership::allStatistics();

            $response = [
                'general_count' => $general_statistic['total'], 
                'count_by_ramas' => $statistics_ramas,
                'zonal_count' => $statistics_zonal['total']
            ];

            echo json_encode($response);
        }
    }
?>