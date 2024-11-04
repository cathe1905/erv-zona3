import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { jwtDecode}  from "jwt-decode";
import { capitalize } from "../../../funciones";
import { useNavigate } from "react-router-dom";

const Logout= () => {
  localStorage.removeItem('token');
  location.href = '/';
}

export const getDestacamento= () => {
  const token = localStorage.getItem('token');
  if (!token) {
      return null;
  }
  try {
      const destacamento = jwtDecode(token);
      return destacamento.data;
  } catch (error) {
      console.error("Error decoding token:", error);
      return null;
  }
    
}

const Menu = () => {
  return (
    <>
      <nav className="row  roboto-regular fs-6 ">
        <a className="text-decoration-none mb-3 enlace-menu" href="#home">
          <i className="bi bi-house-door me-2"></i> <span>Home</span>
        </a>
        <a
          className="text-decoration-none  enlace-menu mb-3"
          href="#exploradores"
        >
          <i className="bi bi-people me-2"></i> <span>Exploradores</span>
        </a>

        <a type="button" onClick={Logout}
          className="text-decoration-none roboto-regular fs-6 my-5 enlace-menu"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          <span>Cerrar sesión</span>
        </a>
      </nav>
    </>
  );
};
const Footer = () => {
  return (
    <>
      <hr className="mt-5" />
      <footer className="letra_muy_pequeña text-center roboto-medium ">
        <p className="m-0">Desarrollado por: Catherin Romero</p>
        <a
          className="text-decoration-none text-danger"
          href=" https://personal-portfolio-eta-ashy.vercel.app/"
        >
          Portafolios y contacto
        </a>
      </footer>
    </>
  );
};
const LayoutDest = () => {
  const [show, setShow] = useState(false);
  const [destacamento, setDestacamento] = useState(null);
  const navigate = useNavigate();

  useEffect(() =>{
    const data= getDestacamento();
    if(!data){
      navigate("/");
    }else{
      setDestacamento(data);
    }
  }, [navigate])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if(!destacamento) return null;
  return (
    <>
      {/* Dashboard tamaño desktop */}
      <div className="d-none d-md-flex">
        <div className="col-md-2 bg-white p-md-5 altura-completa">
          <h1 className="titulo_principal color-morado mb-md-4">Dashboard</h1>
          <Menu />
        </div>
        <div className="col-md-10 p-md-4">
          <div className="d-flex flex-row justify-content-between mx-md-3 my-md-4">
            <h1 className="d-none d-md-block titulo_principal text-start">{capitalize(destacamento.destacamento)}</h1>
            <div className="d-flex justify-content-center align-items-center">
              <i className="bi bi-person me-2 fs-4 rounded-circle bg-secondary px-2"></i>
              <div>
                <p className="my-md-0 p-0 fw-bold letra_muy_pequeña">{capitalize(destacamento.destacamento)}</p>
                <p className="my-md-0 letra_muy_pequeña">{destacamento.email}</p>
              </div>
            </div>
          </div>
          <Outlet></Outlet>
          <Footer></Footer>
        </div>
        
      </div>

      {/* Dashboard tamaño mobile */}
      <div className=" d-block d-md-none">
        <div className="row fondo-morado py-3 px-3 m-0 text-white d-flex align-items-center">
          <div className="col-2">
            <a className="d-md-none text" onClick={handleShow}>
              <i className="bi bi-list-nested text-white fw-bolder display-2"></i>
            </a>
          </div>
          <div className="col-10 text-end">
            <h2 className="titulo_principal_mobile ">Exploradores del Rey</h2>
            <h2 className="titulo_principal_mobile">Zona 3</h2>
          </div>
        </div>

        <Offcanvas
          className="d-md-none p-3"
          show={show}
          onHide={handleClose}
          responsive="md"
        >
          <Offcanvas.Header className="row justify-content-between">
            <Offcanvas.Title className="color-morado titulo_secundario col-4 fs-4">
              Admin
            </Offcanvas.Title>
            <button
              className="col-3 fs-4 color-morado"
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
          <Footer></Footer>
        </div>
      </div>
    </>
  );
};

export default LayoutDest;
