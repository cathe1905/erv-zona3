<?php
    namespace Controllers;

    use Model\ZonalLeadership;
   

    class LeadershipController{
        
        public static function getLeadership(){
            $directiva= ZonalLeadership::all();
            echo json_encode($directiva);
        }

        public static function newLeadership(){
            newRecord(ZonalLeadership::class, 'directiva');
        }

        public static function editLeadership(){
            editRecord(ZonalLeadership::class, 'directiva');
        }

        public static function deleteLeadership(){
            deleteRecord(ZonalLeadership::class, 'directiva');
        }
    }

?>