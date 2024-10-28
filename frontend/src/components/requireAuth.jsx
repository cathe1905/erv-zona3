import { useEffect, useState} from "react";
import {jwtDecode} from 'jwt-decode';
import { Outlet, useNavigate } from "react-router-dom";

const RequireAuth = ({role}) => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const info = localStorage.getItem('token');

    useEffect(() => {
        if (info) {
            const token = jwtDecode(info);

            if (token && token.data.role == role) {
                setIsAuthorized(true); 
            } else {
                navigate('/'); 
            }
        } else {
            navigate('/'); 
        }
    }, [info, role, navigate]);

    return isAuthorized ? <Outlet></Outlet> : null;
}

export default RequireAuth