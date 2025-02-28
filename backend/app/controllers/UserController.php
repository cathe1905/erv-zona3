<?php

namespace Controllers;

use Model\User;
use PHPMailer\PHPMailer\PHPMailer;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class UserController
{
    public static function getUsers()
    {
        $users = User::all();
        echo json_encode($users);
    }

    public static function newUser()
    {
        // Verificar si se están enviando datos JSON en la solicitud
        $jsonInput = file_get_contents('php://input');
        // Decodificar el JSON a un array asociativo
        $data = json_decode($jsonInput, true);


        if (isset($data['usuario'])) {
            $token = bin2hex(random_bytes(16));
            $password = $data['usuario']['contraseña'];

            $password_protegida = password_hash($password, PASSWORD_DEFAULT);
            $data['usuario']['contraseña'] = $password_protegida;
            $data['usuario']['token'] = $token;


            $record = new User($data['usuario']);

            $errores = $record->validar();

            if (!empty($errores)) {
                http_response_code(400);
                $response = [
                    'errores' => $errores,
                    'mensaje' => 'No se pudo crear el usuario debido a errores en la entrada.',
                ];
                echo json_encode($response);
                return;
            }

            //Intentar crear el recurso
            $result = $record->crear();
            $result_email = self::sendVerificationEmail($record->email, $record->token, 'verification-user');

            if ($result && $result_email) {
                http_response_code(201);
                $response = [
                    'mensaje' => 'Usuario creado exitosamente, pide al nuevo usuario que revise su email para confirmar la cuenta.',
                ];
                echo json_encode($response);
            } else {
                http_response_code(500);
                $response = [
                    'mensaje' => 'Error al crear usuario o enviar el correo. Intente de nuevo más tarde.'
                ];
                echo json_encode($response);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Error: No se encontró el campo usuario en la solicitud.']);
        }
    }

    public static function sendVerificationEmail($correo, $token, $type)
    {
        $mail = new PHPMailer();

        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'erv.zona3@gmail.com';
        $mail->Password   = getenv('EMAIL_PASS');
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        if ($type === "verification-user") {
            $body = "
            <!DOCTYPE html>
            <html lang='es'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Confirmación de Cuenta</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f2f2f2;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        width: 100%;
                        margin: 0 auto;
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        text-align: center; /* Centrar el contenido */
                    }
                    h1 {
                        color: #008080;
                        margin: 0 0 20px 0; /* Espaciado inferior */
                    }
                    a {
                        display: inline-block;
                        padding: 10px 20px;
                        margin-top: 15px;
                        text-decoration: none;
                        color: #ffffff;
                        background-color: #008080;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                    a:hover {
                        background-color: #006f6f;
                    }
                    p {
                        color: #333;
                        line-height: 1.5;
                        margin: 0 0 20px 0; /* Espaciado inferior */
                    }
                    img {
                        max-width: 100px;
                        margin: 0 auto 20px;
                        display: block;
                    }
                </style>
            </head>
            <body>
                <div class='container' style='max-width: 600px; width: 100%; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;'>
                    <img src='" . getenv('API') . "/imagenes/logo.jpg' alt='Logo de la empresa' style='max-width: 100px; margin: 0 auto 20px; display: block;'>
                    <h1 style='color: #008080; margin: 0 0 20px 0;'>¡Bienvenido a nuestro Sistema de Gestión de datos ERV Zona 3!</h1>
                    <p style='color: #333; line-height: 1.5; margin: 0 0 20px 0;'>Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
                    <a href='" . getenv('API') . "/backend/users/verification?token=" . $token . "' style='display: inline-block; padding: 10px 20px; margin-top: 15px; text-decoration: none; color: #ffffff; background-color: #008080; border-radius: 5px; font-size: 16px;'>Confirma tu cuenta</a>
                    <p style='color: #333; line-height: 1.5; margin: 20px 0 0 0;'>Atentamente,</p>
                    <p style='color: #333; line-height: 1.5; margin: 0;'>E.R.V Zona 3.</p>
                </div>
            </body>
            </html>
            ";
            $mail->Subject = "Confirma tu cuenta";
            $mail->SetFrom('erv.zona3@gmail.com', 'Exploradores del Rey Zona 3');
            $mail->AddAddress($correo, 'Querido Líder / comandante');
            $mail->AddReplyTo('erv.zona3@gmail.com', 'Exploradores del Rey Zona 3');
            $mail->isHTML(TRUE);
            $mail->CharSet = 'UTF-8';
            $mail->MsgHTML($body);
        } elseif ($type === 'reset-password') {
            $body = "
            <!DOCTYPE html>
            <html lang='es'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Recuperar contraseña</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f2f2f2;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        width: 100%;
                        margin: 0 auto;
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        text-align: center; /* Centrar el contenido */
                    }
                    h1 {
                        color: #008080;
                        margin: 0 0 20px 0; /* Espaciado inferior */
                    }
                    a {
                        display: inline-block;
                        padding: 10px 20px;
                        margin-top: 15px;
                        text-decoration: none;
                        color: #ffffff;
                        background-color: #008080;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                    a:hover {
                        background-color: #006f6f;
                    }
                    p {
                        color: #333;
                        line-height: 1.5;
                        margin: 0 0 20px 0; /* Espaciado inferior */
                    }
                    img {
                        max-width: 100px;
                        margin: 0 auto 20px;
                        display: block;
                    }
                </style>
            </head>
            <body>
                <div class='container' style='max-width: 600px; width: 100%; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center;'>
                    <img src='" . getenv('API') . "/imagenes/logo.jpg' alt='Logo de la empresa' style='max-width: 100px; margin: 0 auto 20px; display: block;'>
                    <h1 style='color: #008080; margin: 0 0 20px 0;'>Hola, Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, puedes ignorar este mensaje.</h1>
                    <p style='color: #333; line-height: 1.5; margin: 0 0 20px 0;'>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                    <a href='" . getenv('API') . "/backend/users/verification-token-reset?token=" . $token . "' style='display: inline-block; padding: 10px 20px; margin-top: 15px; text-decoration: none; color: #ffffff; background-color: #008080; border-radius: 5px; font-size: 16px;'>Reestablecer contraseña</a>
                    <p style='color: #333; line-height: 1.5; margin: 20px 0 0 0;'>Este enlace expirará en 30 minutos por razones de seguridad.</p>
                    <p style='color: #333; line-height: 1.5; margin: 0 0 20px 0;'>Si no solicitaste este cambio, por favor, contacta a nuestro soporte de inmediato.</p>
                    <p style='color: #333; line-height: 1.5; margin: 0;'>Atentamente,</p>
                    <p style='color: #333; line-height: 1.5; margin: 0;'>E.R.V Zona 3.</p>
                </div>
            </body>
            </html>
            ";
            $mail->Subject = "Restablecimiento de tu contraseña";
            $mail->SetFrom('erv.zona3@gmail.com', 'Exploradores del Rey Zona 3');
            $mail->AddAddress($correo, 'Querido Líder / comandante');
            $mail->AddReplyTo('erv.zona3@gmail.com', 'Exploradores del Rey Zona 3');
            $mail->isHTML(TRUE);
            $mail->CharSet = 'UTF-8';
            $mail->MsgHTML($body);
        }

        //envío el mensaje, comprobando si se envió correctamente
        if (!$mail->send()) {
            echo json_encode(['error' => $mail->ErrorInfo]);
        } else {
            return true;
        }
    }

    public static function verificationUser()
    {
        header('Content-Type: application/json; charset=UTF-8');
        $token = $_GET['token'];

        if (!$token) {
            http_response_code(400);
            echo json_encode(['error' => 'Token inválido']);
            return;
        }

        $usuario = User::find_field_record('usuarios', 'token', $token);


        if (!$usuario) {
            http_response_code(404);
            echo json_encode(['error' => 'No se pudo realizar la verificación, por favor asegúrate de crear el registro primero']);
            return;
        }
        $usuario['verificado'] = 1;
        $usuario_act = new User($usuario);
        $result = $usuario_act->actualizar();

        if ($result) {
            header("Location: " . getenv('URL_FRONTEND') . "/verificacion-exitosa");
            exit();
        } else {
            header("Location: " . getenv('URL_FRONTEND') . "/verificacion-fallida");
            exit();
        }
    }

    public static function editUser()
    {

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            editRecord(User::class, 'usuario');
        } else {
            $jsonInput = file_get_contents('php://input');
            $data = json_decode($jsonInput, true);

            $resultado = User::update($data['usuario']);
            if ($resultado) {
                http_response_code(200);
                echo json_encode(['mensaje' => 'Usuario actualizado exitosamente']);
            } else {
                http_response_code(500);
                echo json_encode(['mensaje' => 'Error al actualizar el usuario']);
            }
        }
    }

    public static function deleteUser()
    {
        deleteRecord(User::class, 'usuario');
    }

    public static function authUser()
    {
        header('Content-Type: application/json; charset=utf-8'); // Establecer la cabecera
        $jsonInput = file_get_contents('php://input');
        $data = json_decode($jsonInput, true);

        if (!isset($data['email']) || !isset($data['contraseña'])) {
            http_response_code(404);
            echo json_encode(['error' => ' Email o contraseña no encontrado']);
            return;
        }

        $email = $data['email'];
        $contraseña = $data['contraseña'];

        $user = User::datos_auth($email);
        if ($user) {
            if (password_verify($contraseña, $user['contraseña'])) {

                $jwtSecret = getenv('JWT_SECRET');

                // Datos a incluir en el token
                $payload = [
                    'iss' => getenv('API'), // Emisor del token
                    'aud' => getenv('API'), // Audiencia del token
                    'iat' => time(),              // Tiempo de emisión
                    'exp' => time() + (14400),  // 4 horas
                    'data' => [
                        'id' => $user['id'],
                        'nombre' => $user['nombre'],
                        'apellido' => $user['apellido'],
                        'email' => $email,           // ID del usuario
                        'role' => $user['rol'],
                        'destacamento' => $user['destacamento'],
                        'destacamento_id' => $user['destacamento_id']
                    ]
                ];
                $jwt = JWT::encode($payload, $jwtSecret, 'HS256');
                http_response_code(200);
                echo json_encode(([
                    'status' => 'success',
                    'token' => $jwt
                ]));
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Contraseña incorrecta']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Este email no esta registrado, o aun no ha sido verificado a través del email']);
        }
    }

    public static function refreshToken()
    {
        header('Content-Type: application/json; charset=utf-8');
        $jsonInput = file_get_contents('php://input');
        $data = json_decode($jsonInput, true);

        if (!isset($data['refresh_token'])) {
            echo json_encode(['error' => 'Refresh token missing']);
            http_response_code(400);
            return;
        }

        $refreshToken = $data['refresh_token'];
        if (!is_string($refreshToken) || empty($refreshToken)) {
            echo json_encode(['error' => 'Invalid refresh token format']);
            http_response_code(400); // Bad Request
            return;
        }
        $jwtSecret = $_ENV['JWT_SECRET'];


        try {
            // Decodificar el refresh token
            $decoded = JWT::decode($refreshToken, new Key($jwtSecret, 'HS256'));

            $newAccessToken = self::generateAccessToken($decoded->data);

            echo json_encode([
                'access_token' => $newAccessToken
            ]);
            http_response_code(200);
        } catch (\Exception $e) {

            echo json_encode(['error' => $e . 'Invalid refresh token']);
            http_response_code(401);
        }
    }
    private static function generateAccessToken($userData)
    {
        $jwtSecret = $_ENV['JWT_SECRET'];

        $payload = [
            'iss' => getenv('API'),
            'aud' => getenv('API'),
            'iat' => time(),
            'exp' => time() + (14400),
            'data' => [
                'id' => $userData->id,
                'nombre' => $userData->nombre,
                'apellido' => $userData->apellido,
                'email' => $userData->email,
                'role' => $userData->role,
                'destacamento' => $userData->destacamento
            ]
        ];
        $jwt = JWT::encode($payload, $jwtSecret, 'HS256');
        return $jwt;
    }

    public static function getUserEmail()
    {
        try {
            $email = $_GET['email'];
            if (!$email) {
                http_response_code(400);
                echo json_encode(['error' => 'email inválido']);
                return;
            }

            $record = User::find_by_email($email);

            if (!$record) {
                http_response_code(404);
                echo json_encode(['error' => 'El correo: ' . $email . ' no esta registrado.']);
                return;
            } else {
                http_response_code(200);
                echo json_encode(['id' => $record['id']]);
            }
        } catch (\Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function recoverPassword()
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $email = $_GET['email'];
            if (!$email) {
                http_response_code(400);
                echo json_encode(['error' => 'email inválido']);
                return;
            }

            $record = User::find_by_email($email);

            if (!$record) {
                http_response_code(404);
                echo json_encode(['error' => 'El correo: ' . $email . ' no esta registrado.']);
                return;
            }

            $jwtSecret = getenv('JWT_SECRET');
            $payload = [
                'iat' => time(),        // Fecha de emisión
                'exp' => time() + 14400, // Fecha de expiración
                'data' => [
                    'email' => $email,    //Email del usuario que solicito el cambio de contraseña
                ]
            ];
            $jwt = JWT::encode($payload, $jwtSecret, 'HS256');


            if (!$jwt) {
                http_response_code(404);
                echo json_encode(['error' => 'No se pudo generar el token.']);
                return;
            }

            // Decodificar el token
            $decoded = JWT::decode($jwt, $jwtSecret, ['HS256']);

            // Acceder a la fecha de expiración
            $expirationDate = date('Y-m-d H:i:s', $decoded->exp);
            $record['reset_password_token'] = $jwt;
            $record['reset_password_expires'] = $expirationDate;
            $usuario_act = new User($record);


            $result = $usuario_act->actualizar();

            if (!$result) {
                http_response_code(404);
                echo json_encode(['error' => 'Hubo problemas guardando el token de recuperación de contraseña']);
                return;
            }

            $mail_token = self::sendVerificationEmail($email, $jwt, 'reset-password');

            if ($mail_token) {
                http_response_code(200);
                echo json_encode(['mensaje' => 'Revise su correo electrónico y acceda al enlace para recuperar su contraseña. Podría tardar unos minutos.']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'No se pudo enviar el correo de recuperación de contraseña.']);
            }
        } catch (\Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function passwordReset()
    {
        header('Content-Type: application/json; charset=utf-8');
        $jsonInput = file_get_contents('php://input');
        $data = json_decode($jsonInput, true);
        $jwtSecret = getenv('JWT_SECRET');
        try {
            $token = $data['token'];
            $newPassword= $data['password'];

            if (!$token || !$newPassword) {
                http_response_code(400);
                echo json_encode(['error' => 'Token o nueva contraseña ausentes.']);
                return;
            }

            $decoded = JWT::decode($token, $jwtSecret, ['HS256']);
          
            
            $creationDate = $decoded->iat;
            $currentTime = time();
            $expirationTime = 1800;

            if (($currentTime - $creationDate) > $expirationTime) {
                http_response_code(401); 
                echo json_encode(['error' => 'El token ha expirado, puedes solicitar otro nuevamente.']);
                return;
            }

            $usuario = User::find_field_record('usuarios', 'reset_password_token', $token);

            if (!$usuario) {
                http_response_code(400);
                echo json_encode(['error' => 'El token no esta vinculado a ningún usuario en nuestra Base de datos.']);
                return;
            }

            $password_protegida = password_hash($newPassword, PASSWORD_DEFAULT);

            $usuario['contraseña'] = $password_protegida;
            $usuario_act = new User($usuario);
            $result = $usuario_act->actualizar();

            if (!$result) {
                http_response_code(404);
                echo json_encode(['error' => 'Hubo problemas actualizando la contraseña.']);
                return;
            }else{
                http_response_code(200);
                echo json_encode(['mensaje' => 'Contraseña cambiada exitosamente']);
            }


        } catch (\Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function verificationTokenRecoverPassword()
    {
        header('Content-Type: application/json; charset=UTF-8');
        $jwtSecret = getenv('JWT_SECRET');
        try {
            $token = $_GET['token'];

            if (!$token) {
                http_response_code(400);
                echo json_encode(['error' => 'Token no recibido.']);
                return;
            }

            //verificamos que el token corresponda al email
            $usuarioByToken = User::find_field_record('usuarios', 'reset_password_token', $token);

            if (!$usuarioByToken) {
                http_response_code(404);
                echo json_encode(['error' => 'No se encontró el token.']);
                return;
            }

            $decoded = JWT::decode($token, $jwtSecret, ['HS256']);
          
            // Acceder a la fecha y hora de la creación
            $creationDate = $decoded->iat;
            $currentTime = time();
            $expirationTime = 1800;

            if (($currentTime - $creationDate) > $expirationTime) {
                http_response_code(401); 
                echo json_encode(['error' => 'El token ha expirado, puedes solicitar otro nuevamente.']);
                return;
            }else{
                header("Location: " . getenv('URL_FRONTEND') . "/ingresar-nueva-contraseña?token=" . $token);
            }

        } catch (\Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function isTokenValid(){
        $jwtSecret = getenv('JWT_SECRET');
        try {
            $token = $_GET['token'];

            if (!$token) {
                http_response_code(400);
                echo json_encode(['error' => 'Enlace no permitido']);
                return;
            }

            $decoded = JWT::decode($token, $jwtSecret, ['HS256']);
          
            // Acceder a la fecha y hora de la creación
            $creationDate = $decoded->iat;
            $currentTime = time();
            $expirationTime = 1800;

            if (($currentTime - $creationDate) > $expirationTime) {
                http_response_code(401); 
                echo json_encode(['error' => 'El token ha expirado, puedes solicitar otro nuevamente.']);
                return;
            }else{
                http_response_code(200);
                echo json_encode(['mensaje' => 'Token verificado exitosamente.']);
            }

        } catch (\Exception $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
