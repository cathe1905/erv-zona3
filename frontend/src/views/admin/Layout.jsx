import { Outlet } from "react-router-dom";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

const Menu= ( ) =>{
    return (
        <>
            <h2>Administrador</h2>
            <ul>
                <li><i class="bi bi-house-door"></i> <p>Home</p></li>
                <li><i class="bi bi-people"></i><p>Exploradores</p></li>
                <li><i class="bi bi-building"></i><p>Destacamentos</p></li>
                <li><i class="bi bi-briefcase"></i><p>Directiva Zonal</p></li>
                <li> <i class="bi bi-star"></i><p>Ascensos</p></li>
                <li><i class="bi bi-person"></i><p>Usuarios</p></li>
            </ul>

            <div>
                <i class="bi bi-box-arrow-right"></i>
                <a href="/">Logout</a>
            </div>
            
        </>
    )
}
const Layout = () =>{
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return(
            <div className="row h-100" style={{ height: '100vh'  }}>
                <div className="col-md-3 bg-white d-none d-md-block" >
                <Menu />
                </div>
                <div className="col-12 col-md-9 " style={{ backgroundColor: '#E5E7EB' }}>
                    
                    <Button variant="warning" className="d-md-none" onClick={handleShow}>
                    <i class="bi bi-list"></i>
                    </Button>
                    <Offcanvas className="d-md-none" show={show} onHide={handleClose} responsive="md">
                        <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Menú</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Menu />
                        </Offcanvas.Body>
                    </Offcanvas>
                    
                    
                    <Outlet></Outlet>
                    <footer style={{ fontSize: '12px' }} >
                    <p>Desarrollado por Catherin Romero</p>
                    <a href=" https://personal-portfolio-eta-ashy.vercel.app/">Échale un vistazo a mi portafolios</a>
                </footer>
                </div>
               
                
            </div>
        )
}

export default Layout;

