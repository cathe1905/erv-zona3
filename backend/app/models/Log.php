<?php
   
    namespace Model;

    class Log extends ActiveRecord{

        public static $table= 'admin_log';
        public static $columnsDB= ['id', 'admin_id', 'action', 'target_id', 'details', 'date' ];

        public $id;
        public $admin_id;
        public $action;
        public $target_id;
        public $details;
        public $date;

        public function __construct($arg = []) {
            $this->id = $arg['id'] ?? null;
            $this->admin_id = $arg['admin_id'] ?? '';
            $this->action = $arg['action'] ?? '';
            $this->target_id = $arg['target_id'] ?? '';
            $this->details = $arg['details'] ?? '';
            $this->date =date('Y-m-d H:i:s');  
        }

        public function validar() {
            if (!$this->admin_id) {
                self::$errors[] = "El campo admin_id es obligatorio";
            }
            
            if (!$this->action) {
                self::$errors[] = "El campo action es obligatorio";
            }
            
            if (!$this->target_id) {
                self::$errors[] = "El campo target_id es obligatorio";
            }
            
            if (!$this->details) {
                self::$errors[] = "El campo details es obligatorio";
            }
    
            return self::$errors;
        }

    }
?>