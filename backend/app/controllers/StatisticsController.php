<?php
    namespace Controllers;

    //importo los modelos que usaré
    use Model\Statistics;
    use Model\ZonalLeadership;

    class StatisticsController{

        public static function getStatistics(){

            $destacamento= isset($_GET['destacamento']) ? $_GET['destacamento'] : null;
            // llamo los métodos allStatistics en cada modelo segun su tabla(exploradores o directiva zonal)
            //llamo el método de estadísticas por rama, creada en el modelo de estadística.
            $general_statistic= Statistics::allStatistics($destacamento);
            $statistics_ramas= Statistics::getStatisticsByRama($destacamento);
            $statistics_zonal= ZonalLeadership::allStatisticsZonal();

            $response = [
                'general_count' => $general_statistic['total'], 
                'count_by_ramas' => $statistics_ramas,
            ];
            if(!$destacamento){
                $response['zonal_count'] = $statistics_zonal['total'];
            } 

            echo json_encode($response);
        }
    }
?>