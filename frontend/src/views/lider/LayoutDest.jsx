import { Outlet } from "react-router-dom";

const LayoutDest = () =>{
    return(
        <div>Este es el esqueleto de la aplicacion para destacamento, barra lateral, footer y demas, se repite siempre
             <Outlet></Outlet>
        </div>
       
    )
}

export default LayoutDest;