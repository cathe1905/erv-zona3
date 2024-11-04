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

            $errores= $record->validar();
            //  = User::getErrores();

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
            //CUANDO TENGA DOMINIO IMPLEMENTAR EL ENVIO DE CORREOS
            // $result_email = self::sendVerificationEmail($record->email, $record->token);

            if ($result) {
                http_response_code(201);
                $response = [
                    'mensaje' => 'Usuario creado exitosamente, email enviado exitosamente',
                ];
                echo json_encode($response);
            } else {
                http_response_code(500);
                $response = [
                    'mensaje' => 'Error al crear usuario o enviar el correo. Intente nuevamente más tarde.' 
                ];
                echo json_encode($response);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Error: No se encontró el campo usuario en la solicitud.']);
        }
    }

    public static function sendVerificationEmail($correo, $token)
    {
        $mail = new PHPMailer();
        // Configuración del servidor SMTP, CAMBIAR CREDENCIALES CUANDO TENGA DOMINIO

        $mail->isSMTP();                                           
        $mail->Host       = 'sandbox.smtp.mailtrap.io';                    
        $mail->SMTPAuth   = true;                                
        $mail->Username   = '22ef6e034d610b';              
        $mail->Password   = 'c20ad2d3e5444b';            
        $mail->SMTPSecure = 'tls';      
        $mail->Port       = 2525;

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
                    margin: auto;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #008080; /* Azul turquesa */
                }
                a {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 15px;
                    text-decoration: none;
                    color: white;
                    background-color: #008080; /* Azul turquesa */
                    border-radius: 5px;
                    transition: background-color 0.3s;
                }
                a:hover {
                    background-color: #006f6f; /* Color más oscuro al pasar el mouse */
                }
                p {
                    color: #333;
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>¡Hola!</h1>
                <p>Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
                <a href='http://erv-zona3/backend/users/verification?token=" . $token . "'>Confirma tu cuenta</a>
            </div>
        </body>
        </html>
        ";
        $mail->Subject = "Confirma tu cuenta";
        $mail->SetFrom('catherinr24@gmail.com', 'Catherin Romero');
        $mail->AddAddress($correo, 'Querido Líder o comandante');
        $mail->AddReplyTo('catherinr24@gmail.com', 'Catherin Romero');
        $mail->isHTML(TRUE);
        $mail->CharSet = 'UTF-8'; 
        $mail->MsgHTML($body);

        //envío el mensaje, comprobando si se envió correctamente
        if (!$mail->send()) {
            return "Error al enviar el mensaje: " . $mail->ErrorInfo;
        } else {
            return "Mensaje enviado!!";
        }
    }

    public static function verificationUser(){

        $token= $_GET['token'];

        if(!$token){
            http_response_code(400); 
            echo json_encode(['error' => 'token inválido']);
            return;
        }

        $usuario= User::find_field_record('usuarios', 'token', $token );
        
        
        if(!$usuario){
            http_response_code(404); 
            echo json_encode(['error' => 'No se pudo realizar la verificación, por favor asegúrate de crear el registro primero']);
            return;
        } 
        $usuario['verificado'] = 1;
        $usuario_act= new User($usuario);
        $result = $usuario_act->actualizar();
        
        if ($result) {
            http_response_code(200);
            echo json_encode(['mensaje' => 'El usuario se ha verificado  exitosamente']);
        } else {
            http_response_code(500);
            echo json_encode(['mensaje' => 'Error al verificar el usuario']);
        }

    }

    public static function editUser(){
        editRecord(User::class, 'usuario');
    }

    public static function deleteUser(){
        deleteRecord(User::class, 'usuario');
    }

    public static function authUser(){
        header('Content-Type: application/json; charset=utf-8'); // Establecer la cabecera
        $jsonInput = file_get_contents('php://input');
        $data = json_decode($jsonInput, true); 

        if(!isset($data['email']) || !isset($data['contraseña'])){
            http_response_code(404);
            echo json_encode(['error' =>' Email o contraseña no encontrado']);
            return;
        }

        $email= $data['email'] ;
        $contraseña= $data['contraseña'];

         $user= User::datos_auth($email);
        if($user){
            if(password_verify($contraseña, $user['contraseña'])){

                $jwtSecret = $_ENV['JWT_SECRET'];
              
                // Datos a incluir en el token
                $payload = [
                    'iss' => 'http://erv-zona3/backend/users/auth', // Emisor del token
                    'aud' => 'http://erv-zona3/backend/users/auth', // Audiencia del token
                    'iat' => time(),              // Tiempo de emisión
                    'exp' => time() + (14400),  // 4 horas
                    'data' => [
                        'email' => $email,           // ID del usuario
                        'role' => $user['rol'],
                        'destacamento' => $user['destacamento']        // Rol del usuario
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
                echo json_encode(['error' =>'Contraseña incorrecta']);
            }
        }else{
            http_response_code(404);
                echo json_encode(['error' =>'No esta registrado este email']);
        }



    }

}
