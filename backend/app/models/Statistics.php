<?php
    namespace Model;

    class Statistics extends ActiveRecord{

        public static $table= 'exploradores';
        
        //obtiene las estadísticas por ramas
        public static function getStatisticsByRama(){

            $query= "SELECT COUNT(*) AS total,
                CASE
                    WHEN TIMESTAMPDIFF(YEAR,fecha_nacimiento,CURDATE()) BETWEEN 3 AND 5 THEN 'pre-junior'
                    WHEN TIMESTAMPDIFF(YEAR,fecha_nacimiento,CURDATE()) BETWEEN 6 AND 10 THEN 'pionero'
                    WHEN TIMESTAMPDIFF(YEAR,fecha_nacimiento,CURDATE()) BETWEEN 11 AND 17 THEN 'brijer'
                    WHEN TIMESTAMPDIFF(YEAR,fecha_nacimiento,CURDATE()) >= 18 THEN 'oficial'
                    ELSE 'no clasificado'
                    END AS rama
                FROM " . static::$table . 
                " GROUP BY rama";
            
            $result= static::$db->query($query);
            $statistics_ramas= [];

            if($result){
                while($row= $result->fetch_assoc()){
                    $statistics_ramas[] = $row; 
                }
            }else{
                echo 'Error en la ejecución de la consulta: ' . static::$db->error;
            }
          
            return $statistics_ramas;

        }
        
    }
?>