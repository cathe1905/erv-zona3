<?php
    namespace Controllers;

    use Model\Statistics;
    use Model\ZonalLeadership;

    class StatisticsController{

        public static function getStatistics(){

            $generalStatistic= Statistics::allStatistics();
            $statisticsRamas= Statistics::getStatisticsByRama();
            $statisticsZonal= ZonalLeadership::allStatistics();

            $response = [
                'general_count' => $generalStatistic['total'], 
                'count_by_ramas' => $statisticsRamas,
                'zonal_count' => $statisticsZonal['total']
            ];
            echo json_encode($response);
        }
    }
?>