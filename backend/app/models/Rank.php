<?php
    namespace Model;

    class Rank extends ActiveRecord{
        
        public static $table= 'ascensos';
        public static $columnsDB= ['id', 'nombre', 'rama'];

        public $id;
        public $nombre;
        public $rama;
        
        public static $errors = [];
    
        public function __construct($arg = []) {
            $this->id = $arg['id'] ?? null;
            $this->nombre = $arg['nombre'] ?? '';
            $this->rama = $arg['rama'] ?? '';
        }
    
        public function validar() {
            // El backend valida que los campos obligatorios no estén vacíos.
            if (!$this->nombre) {
                self::$errors[] = "El campo nombre es obligatorio";
            }
    
            if (!$this->rama) {
                self::$errors[] = "El campo rama es obligatorio";
            }
    
    
            return self::$errors;
        }
    
    }
?>