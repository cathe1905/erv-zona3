import { useEffect, useState} from "react";
import {jwtDecode} from 'jwt-decode';
import { Outlet, useNavigate } from "react-router-dom";

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

export const getInfoToken =() => {
    const info = localStorage.getItem('token');
    if (!info) {
        navigate('/'); 
        return null; 
    }
    const token = jwtDecode(info);
    return token || null;
    
}

export default RequireAuth