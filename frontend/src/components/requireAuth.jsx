import { useEffect, useState} from "react";
import {jwtDecode} from 'jwt-decode';
import { Outlet, useNavigate } from "react-router-dom";

const RequireAuth = ({role}) => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const info = localStorage.getItem('token');
    console.log(info)
    useEffect(() => {
        if (info) {
            const token = jwtDecode(info);
            console.log(token)
            if (token && token.data.role == role) {
                setIsAuthorized(true); 
            } else {
                navigate('/'); 
            }
        } else {
            navigate('/'); 
        }
    }, [info, role, navigate]);
    console.log(isAuthorized)
    return isAuthorized ? <Outlet></Outlet> : null;
}

export default RequireAuth