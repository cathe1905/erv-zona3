import { useEffect, useState} from "react";
import {jwtDecode} from 'jwt-decode';
import { Outlet, useNavigate } from "react-router-dom";

const refreshToken= async(data) =>{
    if(!data) return;
        try{
            const respuesta= await fetch('http://erv-zona3/backend/users/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if(respuesta.ok){
                const data = await respuesta.json();
                const token= data.token
                localStorage.setItem('token', token);
                return jwtDecode(token);
            }
        } catch(error){
            console.error('Hubo un problema con la solicitud', error)
            console.log(error)
        }
    
}
const RequireAuth = ({role}) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    // const info = localStorage.getItem('token');
    const navigate = useNavigate();
    // const[token, setToken] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const info = localStorage.getItem("token");
            if (!info) {
                navigate("/");
                return;
            }
            const token = jwtDecode(info);

            // Verificar expiración
            if (Date.now() >= token.exp * 1000) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }
            // Refrescar si está cerca de expirar
            if (token.exp * 1000 <= Date.now() + 5 * 60 * 1000) {
                const refreshedToken = await refreshToken(info);
                if (!refreshedToken) {
                    navigate("/");
                    return;
                }
            }
            if (token.data.role == role) {
                setIsAuthorized(true);
            } else {
                navigate("/");
            }
        };

        checkAuth();
    }, [role, navigate]);

    return isAuthorized ? <Outlet /> : null;
};


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