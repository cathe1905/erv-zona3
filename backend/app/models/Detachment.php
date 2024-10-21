<?php
    namespace Model;

    class Detachment extends ActiveRecord{
        protected static $table = 'destacamentos';
        protected static $columnsDB = ['id', 'nombre', 'comandante_general', 'comandante_femenino', 'comandante_masculino', 'pastor', 'inst_pionero', 'inst_brijer', 'inst_bes', 'secretaria', 'tesorero', 'capellan', 'zona_id'];
        
        public $id;
        public $nombre;
        public $comandante_general;
        public $comandante_femenino;
        public $comandante_masculino;
        public $pastor;
        public $inst_pionero;
        public $inst_brijer;
        public $inst_bes;
        public $secretaria;
        public $tesorero;
        public $capellan;
        public $zona_id;

        public function __construct($arg = [])
        {
            $this->id = $arg['id'] ?? null;
            $this->nombre = $arg['nombre'] ?? '';
            $this->comandante_general = $arg['comandante_general'] ?? '';
            $this->comandante_femenino = $arg['comandante_femenino'] ?? '';
            $this->comandante_masculino = $arg['comandante_masculino'] ?? '';
            $this->pastor = $arg['pastor'] ?? '';
            $this->inst_pionero = $arg['inst_pionero'] ?? '';
            $this->inst_brijer = $arg['inst_brijer'] ?? '';
            $this->inst_bes = $arg['inst_bes'] ?? '';
            $this->secretaria = $arg['secretaria'] ?? '';
            $this->tesorero = $arg['tesorero'] ?? '';
            $this->capellan = $arg['capellan'] ?? '';
            $this->zona_id = $arg['zona_id'] ?? '';
        }

        public function validar() {
            // el backend valida que los campos obligatorios no esten vacios.
            if(!$this->nombre) {
                self::$errors[] = "El campo nombre es obligatorio";
            }
    
            if(!$this->comandante_general) {
                self::$errors[] = 'El campo comandante_general es obligatorio';
            }
    
            if( !$this->comandante_femenino) {
                self::$errors[] = 'El campo comandante_femenino es obligatorio';
            }
    
            if(!$this->comandante_masculino) {
                self::$errors[] = 'El campocomandante_masculino es obligatorio';
            }
            
            if(!$this->pastor ) {
                self::$errors[] = 'El campo pastores obligatorio';
            }

            if(!$this->inst_pionero ) {
                self::$errors[] = 'El campo inst_pionero obligatorio';
            }

            if(!$this->inst_brijer ) {
                self::$errors[] = 'El campo inst_brijer obligatorio';
            }

            if(!$this->inst_bes ) {
                self::$errors[] = 'El campo inst_bes obligatorio';
            }

            if(!$this->zona_id ) {
                self::$errors[] = 'El campo zona_id obligatorio';
            }
    
            return self::$errors;
        }

    }
?>