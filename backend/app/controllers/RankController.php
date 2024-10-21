<?php
    namespace Controllers;

    use Model\Rank;

    class RankController{

        public static function getAscensos(){
            $ascensos= Rank::all();
            echo json_encode($ascensos);
        }

        public static function newAscenso(){
            newRecord(Rank::class, 'ascenso');
        }

        public static function editAscenso(){
            editRecord(Rank::class, 'ascenso');
        }

        public static function deleteAscenso(){
            deleteRecord(Rank::class, 'ascenso');
        }
    }
?>