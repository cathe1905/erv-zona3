import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
    const location= useLocation();
    const [params, setParams] = useSearchParams();
    const rol= params.get('rol');

    return(
        <div>
            <p>Este es el dashboar de administrador rol: {rol} </p>
        </div>
    )

}

export default Dashboard;

