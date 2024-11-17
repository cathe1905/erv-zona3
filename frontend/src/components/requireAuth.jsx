import { useEffect, useState} from "react";
import {jwtDecode} from 'jwt-decode';
import { Outlet, useNavigate } from "react-router-dom";

const refreshToken= async() =>{
    try{
        const respuesta= await fetch('http://erv-zona3/backend/users/refresh', {
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
            
        }
    } catch(error){
        console.error('Hubo un problema con la solicitud', error)
        setError('Hubo un problema con la solicitud');
        console.log(error)
    }
}
const RequireAuth = ({role}) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const info = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof info === 'string') {
            const token = jwtDecode(info);

            if(token && token.exp && Date.now() >= token.exp * 1000){
                localStorage.removeItem('token');
                navigate('/');
                return; 
            }
            if (token && token.data.role == role) {
                setIsAuthorized(true); 
            } else {
                navigate('/'); 
            }
        } else {
            navigate('/'); 

        }
    }, [info, navigate]);

    return isAuthorized ? <Outlet></Outlet> : null;
}

// export const getInfoToken =() => {
//     const info = localStorage.getItem('token');
//     if (!info) {
//         navigate('/'); 
//         return null; 
//     }
//     const token = jwtDecode(info);
//     return token || null;
    
// }

export default RequireAuth