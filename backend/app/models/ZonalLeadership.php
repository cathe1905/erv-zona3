<?php
    namespace Model;

    class ZonalLeadership extends ActiveRecord{
        public static $table= 'directiva_zonal';
        public static $columnsDB= ['id', 'nombres', 'apellidos', 'ascenso', 'cargo', 'telefono', 'foto', 'destacamento_id' ];
        
        public $id;
        public $nombres;
        public $apellidos;
        public $ascenso;
        public $cargo;
        public $telefono;
        public $foto;
        public $destacamento_id;

        public function __construct($arg = [])
        {
            $this->id = $arg['id'] ?? null;
            $this->nombres = $arg['nombres'] ?? '';
            $this->apellidos = $arg['apellidos'] ?? '';
            $this->ascenso = $arg['ascenso'] ?? '';
            $this->cargo = $arg['cargo'] ?? '';
            $this->telefono = $arg['telefono'] ?? '';
            $this->foto = $arg['foto'] ?? '';
            $this->destacamento_id = $arg['destacamento_id'] ?? null;
        }

        public function validar() {
            // El backend valida que los campos obligatorios no estén vacíos.
            if (!$this->nombres) {
                self::$errors[] = "El campo nombres es obligatorio";
            }
        
            if (!$this->apellidos) {
                self::$errors[] = "El campo apellidos es obligatorio";
            }
        
            if (!$this->ascenso) {
                self::$errors[] = "El campo ascenso es obligatorio";
            }
        
            if (!$this->cargo) {
                self::$errors[] = "El campo cargo es obligatorio";
            }
            
            if (!$this->telefono) {
                self::$errors[] = "El campo teléfono es obligatorio";
            }
        
            if (!$this->destacamento_id) {
                self::$errors[] = "El campo destacamento_id es obligatorio";
            }
        
            if(!$this->id )  {
                $this->validarImagen();
            }
        
            return self::$errors;
        }
        public function validarImagen() {
            if(!$this->foto ) {
                self::$errors[] = 'La Imagen es Obligatoria';
            }
        }

        public static function all(){
            $query= "SELECT 
            dz.id, 
            dz.nombres, 
            dz.apellidos, 
            dz.ascenso, 
            dz.cargo, 
            dz.telefono,
            dz.foto,
            dt.nombre AS destacamento 
             FROM directiva_zonal AS dz INNER JOIN destacamentos as dt ON dt.id = dz.destacamento_id";

            $result= static::$db->query($query);
            $destacamentos= [];

            if($result){
                while($row= $result->fetch_assoc()){
                    $destacamentos[] = $row;
                }
            }else{
                echo 'Error en la ejecución de la consulta: ' . static::$db->error;
            }
            return $destacamentos;
        }
        public static function allStatisticsZonal(){
            // se obtiene el conteo de los registros por tablas
            $query= "SELECT COUNT(*) AS total FROM " . static::$table;

            $result= static::$db->query($query);
            $statistic= $result->fetch_assoc();

            return $statistic;
        }
        
    }

?>