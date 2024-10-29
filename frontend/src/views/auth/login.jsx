import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function LoginPage(){
    const [loged, setLoged] = useState(false);
    const [error, setError] = useState();
    const navigate = useNavigate();

    const logIn = async (e) => {
        e.preventDefault();

        const datos = {
            email: e.target.email.value,
            contraseña: e.target.contraseña.value,
        };

        try{
            const respuesta= await fetch('http://erv-zona3/backend/users/auth', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(datos)
            });
            

            if(respuesta.ok){

                setLoged(true);
                const data = await respuesta.json();
                localStorage.setItem('token', data.token);

                const data_decode= jwtDecode(data.token);
    
                if(data_decode.data.role == 1){
                    navigate('/dashboard/admin')

                } else if(data_decode.data.role == 2){
                    navigate(`/dashboard/dest?destacamento=${data_decode.data.destacamento}`)

                }
                
            }else {
                setError('Error al iniciar sesión');
                alert('contraseña o email incorrectos')
                
            }
        } catch(error){
            console.error('Hubo un problema con la solicitud', error)
            setError('Hubo un problema con la solicitud');
            console.log(error)
        }
    }

    return (
        <div>
            <h1>Ingresa a tu dashboard</h1>
            <form onSubmit={logIn}>
                <input type="text" name="email" placeholder="Tu Email"/>
                <input type="password" name="contraseña" placeholder="Tu contraseña"/>
                <button type="submit">Enviar</button>
            </form>
        
        </div>
    )
}

export default LoginPage;