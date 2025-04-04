<?php

namespace Controllers;

use Intervention\Image\ImageManagerStatic as Image;
use Model\User;

define('CARPETA_IMAGENES', $_SERVER['DOCUMENT_ROOT'] . '/imagenes/');

function debuguear($variable)
{
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
}

function newRecord($class, $type)
{
    try {
        // Verificar si se están enviando datos JSON en la solicitud
        $jsonInput = file_get_contents('php://input');
        // Decodificar el JSON a un array asociativo
        $data = json_decode($jsonInput, true);
        $imagen = null;

        if (isset($data[$type])) {
            $record = new $class($data[$type]);
            $record->validar();
            $errores = $class::getErrores();

            if (!empty($errores)) {
                http_response_code(400);
                $response = [
                    'errores' => $errores,
                    'mensaje' => 'No se pudo crear el ' .  $type . 'debido a errores en la entrada.',
                ];
                echo json_encode($response);
                return;
            }

            if ($type === 'directiva') {
                $base64String = $data[$type]['foto'];
                // Verificar si la cadena contiene el prefijo adecuado
                if (strpos($base64String, 'data:image/') !== false) {
                    // Eliminar el prefijo
                    $base64String = preg_replace('/^data:image\/\w+;base64,/', '', $base64String);
                }
                // Decodificar la imagen
                $image_data = base64_decode($base64String);
                if ($image_data === false) {
                    echo json_encode(['error' => 'La cadena Base64 no se pudo decodificar']);
                    return;
                }
                $nombreImagen = md5(uniqid(rand(), true)) . ".jpg";

                if ($image_data) {
                    $imagen = Image::make($image_data);
                    $record->setImagen($nombreImagen);
                    $imagen->save(CARPETA_IMAGENES . $nombreImagen);

                    // Generar la URL pública de la imagen
                    $urlImagen = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/imagenes/' . $nombreImagen;
                }
            }
            //Intentar crear el recurso
            $result = $record->crear();

            if ($result) {
                http_response_code(201);
                $response = [
                    'mensaje' => $type . ' creado exitosamente.',
                    'registro' => $record,
                    'imagen_url' => $urlImagen ?? null // URL de la imagen guardada
                ];
                echo json_encode($response);
            } else {
                http_response_code(500);
                $response = [
                    'mensaje' => 'Error al crear el ' . $type . 'Intente nuevamente más tarde.',
                ];
                echo json_encode($response);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Error: No se encontró el campo ' . $type . 'en la solicitud.']);
        }
    } catch (\Exception $e) {
        http_response_code(500);
        // Aquí puedes agregar log a archivo o base de datos también
        error_log("Error al crear nuevo registro: " . $e->getMessage());
        echo json_encode([
            'error' => 'Ocurrió un error inesperado: ' . $e->getMessage(),
        ]);
    }
}

function editRecord($class, $type)
{

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        try {
            $id = $_GET['id'];
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'ID inválido']);
                return;
            }

            $record = $class::find($id);

            if (!$record) {
                http_response_code(404);
                echo json_encode(['error' => $type . ' no encontrado']);
                return;
            }
            echo json_encode($record);
        } catch (\Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    } else {
        try {
            // se ejecuta código para método POST

            $jsonInput = file_get_contents('php://input');
            $data = json_decode($jsonInput, true);

            // Cargar el post existente, aqui esta la imagen antigua.
            $postOriginal = $class::find($data[$type]['id']);
            $postDecode = (array) $postOriginal;

            if (!$postOriginal) {
                // Si el post no existe, manejar el error
                http_response_code(404);
                echo json_encode(['error' => $type . ' no encontrado']);
                return;
            }

            $record = new $class($data[$type]);

            $errores = $record->validar();

            if (!empty($errores)) {
                http_response_code(400);
                echo json_encode(['errores' => $errores]);
                return;
            }
            //se hace el mismo procedimiento de crear a imagen ya que todo se reescribe
            if ($type === 'directiva') {

                $base64String = $data[$type]['foto'];

                if (!terminaEnJpg($base64String)) {
                    // Verificar si la cadena contiene el prefijo adecuado
                    if (strpos($base64String, 'data:image/') !== false) {
                        // Eliminar el prefijo
                        $base64String = preg_replace('/^data:image\/\w+;base64,/', '', $base64String);
                    }
                    // Decodificar la imagen
                    $image_data = base64_decode($base64String);
                    if ($image_data === false) {
                        echo json_encode(['error' => 'La cadena Base64 no se pudo decodificar']);
                        return;
                    }
                    $nombreImagen = md5(uniqid(rand(), true)) . ".jpg";

                    if ($image_data) {
                        $imagen = Image::make($image_data);
                        $record->setImagen($nombreImagen, $postDecode['foto']);
                        $imagen->save(CARPETA_IMAGENES . $nombreImagen);
                    }
                }
            }

            $result = $record->actualizar();
            if ($result) {
                http_response_code(200);
                echo json_encode(['mensaje' => $type . ' actualizado exitosamente']);
            } else {
                http_response_code(500);
                echo json_encode(['mensaje' => 'Error al actualizar el ' . $type]);
            }
        } catch (\Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

function deleteRecord($class, $type)
{
    try {
        $jsonInput = file_get_contents('php://input');
        $data = json_decode($jsonInput, true);
        $id = filter_var($data['id'], FILTER_VALIDATE_INT);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID no encontrado']);
            return;
        }

        $record = $class::find($id);
        $resultado = $record->eliminar();

        if ($resultado) {
            http_response_code(200);
            echo json_encode(['mensaje' => $type . ' eliminado exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Error al eliminado el ' . $type]);
        }
    } catch (\Exception $e) {
        http_response_code($e->getCode() ?: 500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function loadEnv($filePath)
{
    if (file_exists($filePath)) {
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            [$key, $value] = explode('=', $line, 2);
            putenv("$key=$value");
        }
    }
}

function terminaEnJpg($cadena)
{
    // Convertir la cadena a minúsculas para hacer la comparación insensible a mayúsculas/minúsculas
    $cadena = strtolower($cadena);
    // Obtener los últimos 4 caracteres de la cadena
    $extension = substr($cadena, -4);
    // Verificar si la extensión es ".jpg"
    return $extension === '.jpg';
}
