<?php

namespace Model;


class PaymentsRequests extends ActiveRecord
{
    protected static $table = 'solicitudes_pagos';
    protected static $columnsDB = ['id', 'responsable_id', 'destacamento_id', 'comprobante_imagen', 'oficiales_ids', 'relaciones_oficiales_meses', 'monto', 'valor_cuota', 'tasa', 'referencia', 'estatus'];

    public $id;
    public $responsable_id;
    public $destacamento_id;
    public $comprobante_imagen;
    public $oficiales_ids;
    public $relaciones_oficiales_meses;
    public $monto;
    public $valor_cuota;
    public $tasa;
    public $referencia;
    public $estatus;
    public $fecha_solicitud;

    public function __construct($arg = [])
    {
        $this->id = $arg['id'] ?? null;
        $this->responsable_id = $arg['responsable_id'] ?? '';
        $this->destacamento_id = $arg['destacamento_id'] ?? '';
        $this->comprobante_imagen = $arg['comprobante_imagen'] ?? '';
        $this->oficiales_ids = $arg['oficiales_ids'] ?? [];
        $this->relaciones_oficiales_meses = $arg['relaciones_oficiales_meses'] ?? [];
        $this->monto = $arg['monto'] ?? '';
        $this->valor_cuota = $arg['valor_cuota'] ?? '';
        $this->tasa = $arg['tasa'] ?? '';
        $this->referencia = $arg['referencia'] ?? '';
        $this->estatus = $arg['estatus'] ?? null;
    }

    public function validar()
    {
        // el backend valida que los campos obligatorios no esten vacios.
        if (!$this->responsable_id) {
            self::$errors[] = "El campo responsable_id es obligatorio";
        }

        if (!$this->destacamento_id) {
            self::$errors[] = 'El campo destacamento_id es obligatorio';
        }

        if (!$this->id) {
            $this->validarImagen();
        }

        if (!$this->oficiales_ids) {
            self::$errors[] = 'El campo oficiales_ids es obligatorio';
        }

        if (!$this->relaciones_oficiales_meses) {
            self::$errors[] = 'El campo relaciones_oficiales_meses es obligatorio';
        }

        if (!$this->monto) {
            self::$errors[] = 'El campo monto es obligatorio';
        }

        if (!$this->valor_cuota) {
            self::$errors[] = 'El campo valor_cuota es obligatorio';
        }

        if (!$this->tasa) {
            self::$errors[] = 'El campo monto es obligatorio';
        }

        if (!$this->referencia) {
            self::$errors[] = 'El campo referencia es obligatorio';
        }


        return self::$errors;
    }

    public function validarImagen()
    {
        if (!$this->comprobante_imagen) {
            self::$errors[] = 'La Imagen es Obligatoria';
        }
    }

    public function setImagen($imagen, $imagen_antigua = null)
    {
        // Elimina la imagen previa
        if (!is_null($this->id)) {
            $this->borrarImagen($imagen_antigua);
        }
        // Asignar al atributo de imagen el nombre de la imagen
        if ($imagen) {
            $this->comprobante_imagen = $imagen;
        }
    }
    public function sanitizarAtributos()
    {
        $atributos = $this->atributos(); // Obtener atributos
        $sanitizado = []; // Inicializamos el array para almacenar los datos sanitizados

        // Recorremos cada clave-valor de los atributos
        foreach ($atributos as $key => $value) {
            if ($value !== null) {
                // Si la clave no es 'relaciones_oficiales_meses' ni 'oficiales_ids', escapamos el valor directamente
                if ($key !== 'relaciones_oficiales_meses' && $key !== 'oficiales_ids') {
                    $sanitizado[$key] = self::$db->escape_string($value);
                } else {
                    // Para 'relaciones_oficiales_meses' y 'oficiales_ids', debemos manejar sus arrays asociativos
                    // 'oficiales_ids' siempre tendrá una clave 'oficiales' con un array de strings
                    if ($key === 'oficiales_ids') {
                        // Recorremos el array de 'oficiales' y escapamos cada valor
                        foreach ($value as $key2 => $value2) {
                            if ($key2 === 'oficiales' && is_array($value2)) {
                                // Escapamos cada elemento del array de 'oficiales'
                                $sanitizado[$key][$key2] = array_map(function ($item) {
                                    return self::$db->escape_string($item);
                                }, $value2);
                            }
                        }
                    }
                    // 'relaciones_oficiales_meses' puede tener muchas llaves con arrays de strings
                    elseif ($key === 'relaciones_oficiales_meses') {
                        // Recorremos cada valor del array asociativo
                        foreach ($value as $key2 => $value2) {
                            if (is_array($value2)) {
                                // Escapamos cada elemento del array de 'relaciones_oficiales_meses'
                                $sanitizado[$key][$key2] = array_map(function ($item) {
                                    return self::$db->escape_string($item);
                                }, $value2);
                            }
                        }
                    }
                }
            }
        }

        return $sanitizado;
    }

    public static function all_paymets_requests($estatus, $destacamento_id, $año, $mes, $page, $limit, $id = null)
    {
        $query = "SELECT 
            sp.id, 
            sp.comprobante_imagen,
            sp.monto,
            sp.valor_cuota,
            sp.tasa,
            sp.referencia,
            sp.estatus,
            sp.fecha_solicitud,
            
            JSON_OBJECT(
                'id', u.id,
                'nombres', u.nombre,
                'apellidos', u.apellido
            ) AS responsable,
    
            JSON_OBJECT(
                'id', d.id,
                'nombre', d.nombre
            ) AS destacamento,
    
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', e.id,
                    'nombres', e.nombres,
                    'apellidos', e.apellidos,
                    'meses', JSON_EXTRACT(sp.relaciones_oficiales_meses, CONCAT('$.', e.id))
                )
            ) AS oficiales_meses
    
        FROM 
            solicitudes_pagos sp
    
        JOIN 
            usuarios u 
            ON u.id = sp.responsable_id
    
        JOIN 
            destacamentos d 
            ON d.id = sp.destacamento_id
    
        JOIN 
            exploradores e 
            ON JSON_CONTAINS(sp.oficiales_ids, JSON_QUOTE(CAST(e.id AS CHAR)), '$.oficiales')";

        $conditions = [];

        if ($estatus !== null) {
            $conditions[] = "sp.estatus = '" . self::$db->escape_string($estatus) . "'";
        }

        if ($destacamento_id !== null) {
            $conditions[] = "d.id = '" . self::$db->escape_string($destacamento_id) . "'";
        }

        if ($año != null && $mes !== null) {
            $conditions[] = "DATE_FORMAT(sp.fecha_solicitud, '%Y/%m') = '" . self::$db->escape_string($año . '/' . $mes) . "'";
        } elseif ($año != null) {
            $conditions[] = "DATE_FORMAT(sp.fecha_solicitud, '%Y') = '" . self::$db->escape_string($año) . "'";
        }

        if ($id !== null) {
            $conditions[] = "sp.id = '" . self::$db->escape_string($id) . "'";
        }

        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }

        $inicio = ($limit * ($page - 1));

        $query .= " GROUP BY 
        sp.id, sp.comprobante_imagen, sp.monto, sp.valor_cuota, sp.tasa, sp.referencia, 
        sp.estatus, sp.fecha_solicitud, responsable, destacamento LIMIT " . self::$db->escape_string($limit) . " OFFSET " . $inicio;

        $result = static::$db->query($query);
        $solicitudes = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                // Convertir los campos JSON a objetos PHP
                $row['responsable'] = json_decode($row['responsable'], true);
                $row['destacamento'] = json_decode($row['destacamento'], true);

                // Procesar oficiales_meses
                $oficialesMeses = json_decode($row['oficiales_meses'], true);
                foreach ($oficialesMeses as &$oficial) {
                    if (isset($oficial['meses']) && is_string($oficial['meses'])) {
                        $oficial['meses'] = json_decode($oficial['meses'], true);
                    }
                }
                $row['oficiales_meses'] = $oficialesMeses;

                $solicitudes[] = $row;
            }
            return $solicitudes;
        } else {
            echo 'Error en la ejecución de la consulta: ' . static::$db->error;
            return false;
        }
    }

    public static function all_paymets_requests_count($estatus, $destacamento_id, $año, $mes, $id)
    {
        $query = "SELECT COUNT(DISTINCT sp.id) as total
              FROM solicitudes_pagos sp
              JOIN usuarios u ON u.id = sp.responsable_id
              JOIN destacamentos d ON d.id = sp.destacamento_id
              JOIN exploradores e ON JSON_CONTAINS(sp.oficiales_ids, JSON_QUOTE(CAST(e.id AS CHAR)), '$.oficiales')";

        $conditions = [];

        if ($estatus !== null) {
            $conditions[] = "sp.estatus = '" . self::$db->escape_string($estatus) . "'";
        }

        if ($destacamento_id !== null) {
            $conditions[] = "d.id = '" . self::$db->escape_string($destacamento_id) . "'";
        }

        if ($año != null && $mes !== null) {
            $conditions[] = "DATE_FORMAT(sp.fecha_solicitud, '%Y/%m') = '" . self::$db->escape_string($año . '/' . $mes) . "'";
        } elseif ($año != null) {
            $conditions[] = "DATE_FORMAT(sp.fecha_solicitud, '%Y') = '" . self::$db->escape_string($año) . "'";
        }

        if ($id !== null) {
            $conditions[] = "sp.id = '" . self::$db->escape_string($id) . "'";
        }

        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }

        $result = static::$db->query($query);

        if ($result) {
            $row = $result->fetch_assoc();
            return $row['total'];
        } else {
            error_log('Error en la ejecución de la consulta de conteo: ' . static::$db->error);
            return 0;
        }
    }

    public static function edit_status($estatus, $id)
    {
        $query = "UPDATE solicitudes_pagos SET estatus = '" . $estatus . "' WHERE id = '" . $id . "'";
        static::$db->query($query);

        if (static::$db->affected_rows > 0) {
            return 'success';
        } else {
            return 'failed';
        }
    }

    public static function hasPendingOrProcessingRequest($destacamento_id)
    {
        $stmt = static::$db->prepare("SELECT estatus 
                                     FROM solicitudes_pagos 
                                     WHERE destacamento_id = ?
                                     ORDER BY fecha_solicitud DESC 
                                     LIMIT 1");
        $stmt->bind_param("i", $destacamento_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return in_array($row['estatus'], ['pending', 'processing']);
        }

        return false;
    }
}
