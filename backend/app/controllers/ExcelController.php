<?php

namespace Controllers;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Model\Explo;
use Model\Detachment;
use Model\ZonalLeadership;
use Model\Rank;
use Model\User;

class ExcelController
{
    public static function descargarExcel()
    {
        $categoria= $_GET['categoria'];

        if(!$categoria) {
            http_response_code(400); 
            echo json_encode(['error' => 'Es necesario especificar la categoría']);
            return;
        }

        $data=[];
        $columnas= [];
        $filename= '';
        $letras = ['A','B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

        if($categoria == 'exploradores'){
            
            $destacamento = isset($_GET['destacamento']) && $_GET['destacamento'] !== 'null' ? intval($_GET['destacamento']) : null;
            $rama = isset($_GET['rama']) && $_GET['rama'] !== 'null' ? $_GET['rama'] : null;
            $query = isset($_GET['query']) && $_GET['query'] !== 'null' ? $_GET['query'] : null;
            $ascenso= isset($_GET['ascenso']) && $_GET['ascenso'] !== 'null' ? intval($_GET['ascenso']) : null;
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
            $all = ($_GET['all'] ?? 'false') === 'true' || ($_GET['all'] ?? '0') === '1';

            $data = Explo::get_exploradores($destacamento, $rama, $ascenso, $query, $page, $limit, $all);
            $columnas = [
                'Num', 
                'Nombre', 
                'Apellido', 
                'Fecha de Nacimiento', 
                'Fecha de Promesacion', 
                'Cargo', 
                'Cédula', 
                'Teléfono', 
                'Email',
                'Edad', 
                'Rama', 
                'Destacamento', 
                'Ascenso'
            ]; 
             // Establecer el nombre del archivo
            $filename = 'Registro_exploradores.xlsx';       
        }

        if($categoria == 'destacamentos'){
            $data= Detachment::all();
            $columnas= [
                'Num',
                'Nombre',
                'Comandante_general',
                'Comandante_femenino',
                'Comandante_masculino',
                'Pastor',
                'Inst_pionero',
                'Inst_brijer',
                'Inst_bes',
                'Secretaria',
                'Tesorero',
                'Capellan',
                'Zona'
            ];
            $filename = 'Registro_destacamentos.xlsx'; 
        }

        if($categoria == 'directiva'){
            $data= ZonalLeadership::all();
            $columnas= [
                'Num',
                'Nombres',
                'Apellidos',
                'Cargo',
                'Telefono',
                'Foto',
                'Destacamento',
                'Ascenso'
            ];
            $filename = 'Registro_directiva.xlsx'; 
        }

        if($categoria == 'ascensos'){
            $data= Rank::all();
            $columnas= [
                'Num',
                'Nombre',
                'Rama',
            ];
            $filename = 'Registro_ascensos.xlsx'; 
        }

        if($categoria == 'usuarios'){
            $data= User::all();
            $columnas= [
                'Num',
                'Nombre',
                'Apellido',
                'Email',
                'Destacamento',
                'Rol'
            ];
            $filename = 'Registro_usuarios.xlsx'; 
        }

        // Crear una nueva hoja de cálculo
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $contador_columns=0;

        // llenar los titulos de la hoja
       foreach($columnas as $column){
            $sheet->setCellValue($letras[$contador_columns] . '1', $column);
            $contador_columns++;
       }
        
        $contador_letras = 1;
        $contador_celda = 2;
        $contador_general = 1;

        //SE RECORRE CADA ELEMENTO DE CADA REGISTRO Y SE ASIGNA A LA CELDA CORRESPONDIENTE
        foreach ($data as $record) {
            $sheet->setCellValue('A' . strval($contador_celda), $contador_general);
            foreach ($record as $key => $value) {
                if($key !== 'id'){
                    if (is_numeric($value) && strlen($value) > 10) {
                        $sheet->setCellValueExplicit($letras[$contador_letras] . strval($contador_celda), $value, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
                    } else {
                        $sheet->setCellValue($letras[$contador_letras] . strval($contador_celda), $value);
                    }
                $contador_letras++;
                }
            }
            $contador_letras = 1;
            $contador_celda++;
            $contador_general++;
        }
        
        $writer = new Xlsx($spreadsheet);
        
        // Establecer encabezados para la descarga
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: max-age=0');
        $writer->save('php://output'); 

        exit;
    }

   
}
