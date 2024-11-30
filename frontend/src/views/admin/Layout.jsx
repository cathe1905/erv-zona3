import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { getUserSession } from "../lider/LayoutDest";
import { useEffect } from "react";
import { capitalize } from "../../funciones";

const Logout= () => {
  localStorage.removeItem('token');
  location.href = '/';
}

const titulo =() =>{
  const location = useLocation();
  switch(location.pathname){
    case "/dashboard/admin":
      return "Bienvenido";
    case "/dashboard/admin/explo":
      return "Exploradores";
    case "/dashboard/admin/destacamentos":
      return "Destacamentos"
    case "/dashboard/admin/directiva":
      return "Directiva Zonal";
    case "/dashboard/admin/ascensos":
      return "Ascensos";
    case "/dashboard/admin/usuarios":
      return "Usuarios";
    case "/dashboard/admin/logs":
      return "Registro de Actividades de Administradores"
    default:
      return "";
  }
}

const Menu = () => {
  return (
    <>
      <nav className="row d-flex flex-column roboto-regular text-white mx-md-2">
        <a className="text-decoration-none mb-3 px-md-3 enlace-menu text-white" href="/dashboard/admin">
          <i className="bi bi-house-door me-2"></i> <span>Home</span>
        </a>
        <a
          className="text-decoration-none text-white enlace-menu mb-3 px-md-3 "
          href="/dashboard/admin/explo"
        >
          <i className="bi bi-people me-2"></i> <span>Exploradores</span>
        </a>
        <a
          className="text-decoration-none text-white enlace-menu mb-3 px-md-3 "
          href="/dashboard/admin/destacamentos"
        >
          <i className="bi bi-building me-2"></i> <span>Destacamentos</span>
        </a>
        <a
          className="text-decoration-none text-white enlace-menu mb-3 px-md-3 "
          href="/dashboard/admin/directiva"
        >
          <i className="bi bi-briefcase me-2"></i> <span>Directiva Zonal</span>
        </a>
        <a className="text-decoration-none text-white enlace-menu mb-3 px-md-3 " href="/dashboard/admin/ascensos">
          <i className="bi bi-star me-2"></i> <span>Ascensos</span>
        </a>
        <a className="text-decoration-none mb-3 text-white enlace-menu px-md-3 " href="/dashboard/admin/usuarios">
          <i className="bi bi-person me-2"></i> <span>Usuarios</span>
        </a>
        <a className="text-decoration-none mb-3 text-white enlace-menu px-md-3 " href="/dashboard/admin/logs">
        <i className="bi bi-search me-2"></i> <span>Actividades de Administradores</span>
        </a>

        <a type="button" onClick={Logout}
          className="text-decoration-none text-white roboto-regular fs-6 mt-5 enlace-menu px-md-3 "
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          <span>Cerrar sesión</span>
        </a>
      </nav>
    </>
  );
};

const Layout = () => {
  const [show, setShow] = useState(false);
  const [admin, setAdmin] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() =>{
    const infoUser= getUserSession();
    setAdmin(infoUser)
  }, [])


  return (
    <>
      {/* Dashboard tamaño desktop */}
      
      <div className="d-none d-md-flex">
        <div className="col-md-2 fondo-menu altura-completa">
          <h1 className="titulo_principal text-white px-4 py-3 mt-4">Admin</h1>
          <Menu />
        </div>
        <div className="col-md-10 p-md-4 margen">
          <div className="d-flex flex-row justify-content-between mx-md-3 my-md-3">
            <h1 className="d-none d-md-block titulo_principal text-start">{titulo()}</h1>
            <div className="d-flex justify-content-center align-items-center">
              <i className="bi bi-person me-2 fs-4 rounded-circle bg-secondary px-2"></i>
              <div>
                <p className="my-md-0 p-0 fw-bold letra_muy_pequeña">{admin ? capitalize(admin.nombre) + " " + capitalize(admin.apellido)  : 'Administrador'}</p>
                <p className="my-md-0 letra_muy_pequeña">{admin ? admin.email  : ''}</p>
              </div>
            </div>
          </div>
          <Outlet></Outlet>
        </div>
        
      </div>

      {/* Dashboard tamaño mobile */}
      <div className=" d-block d-md-none">
        <div className="row fondo-menu py-3 px-3 m-0 text-white d-flex align-items-center">
          <div className="col-2">
            <a className="d-md-none text" onClick={handleShow}>
              <i className="bi bi-list-nested text-white fw-bolder display-2"></i>
            </a>
          </div>
          <div className="col-10 d-flex justify-content-end align-items-center">
              <i className="bi bi-person me-2 fs-4 rounded-circle bg-secondary px-2"></i>
              <div>
                <p className="my-0 p-0 fw-bold letra_muy_pequeña">{admin ? capitalize(admin.nombre) + " " + capitalize(admin.apellido)  : 'Administrador'}</p>
                <p className="my-0 letra_muy_pequeña">{admin ? admin.email  : ''}</p>
              </div>
            </div>
        </div>
        <h1 className="d-md-none mx-4 mt-4 titulo_principal_mobile text-start">{titulo()}</h1>


        <Offcanvas
          className="d-md-none p-3 fondo-menu"
          show={show}
          onHide={handleClose}
          responsive="md"
        >
          <Offcanvas.Header className="row justify-content-between">
            <Offcanvas.Title className="text-white titulo_secundario col-4 fs-4">
              Admin
            </Offcanvas.Title>
            <button
              className="col-3 fs-4 text-white text-end"
              type="button"
              style={{ background: "none", border: "none" }} 
              onClick={handleClose}
              aria-label="Close"
            >
              X
            </button>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Menu />
          </Offcanvas.Body>
        </Offcanvas>
        <div className="py-1">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
};

export default Layout;
