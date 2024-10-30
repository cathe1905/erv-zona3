import { Outlet } from "react-router-dom";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const Menu = () => {
  return (
    <>
      {/* <h1 className="titulo_principal">Administrador</h1> */}
      <nav className="row text-white roboto-bold">
        <a className="text-decoration-none text-white mb-3" href="#home">
          <i className="bi bi-house-door"></i> <span>Home</span>
        </a>
        <a
          className="text-decoration-none text-white mb-3"
          href="#exploradores"
        >
          <i className="bi bi-people"></i> <span>Exploradores</span>
        </a>
        <a
          className="text-decoration-none text-white mb-3"
          href="#destacamentos"
        >
          <i className="bi bi-building"></i> <span>Destacamentos</span>
        </a>
        <a
          className="text-decoration-none text-white mb-3"
          href="#directiva-zonal"
        >
          <i className="bi bi-briefcase"></i> <span>Directiva Zonal</span>
        </a>
        <a className="text-decoration-none text-white mb-3" href="#ascensos">
          <i className="bi bi-star"></i> <span>Ascensos</span>
        </a>
        <a className="text-decoration-none text-white mb-3" href="#usuarios">
          <i className="bi bi-person"></i> <span>Usuarios</span>
        </a>
      </nav>

      <div className="roboto-bold my-5">
        <i className="bi bi-box-arrow-right text-white"></i>
        <a className="text-decoration-none text-white" href="/">
          Logout
        </a>
      </div>
    </>
  );
};
const Layout = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    // <div className="row" style={{ height: "100vh" }}>
    //   <div className="col-md-3 bg-white d-none d-md-block">
    //     <h1>Administrador</h1>
    //     <Menu />
    //   </div>
    //   <div className="col-12 col-md-9 m-0" style={{ backgroundColor: "#E5E7EB" }}>

    //   </div>

    // </div>
    <>
      <div className="row bg-white py-3 px-3 m-0 text-dark d-flex align-items-center">
        <div className="col-2">
          <a className="d-md-none text" onClick={handleShow}>
            <i class="bi bi-list-nested text-dark fw-bolder display-2"></i>
          </a>
        </div>
        <div className="col-10">
          <h2 className="titulo_principal_mobile text-end">Dashboard</h2>
        </div>
      </div>

      <Offcanvas
        className="d-md-none offcanvas-background"
        show={show}
        onHide={handleClose}
        responsive="md"
      >
        <Offcanvas.Header className="row justify-content-between">
          <Offcanvas.Title className="text-white titulo_secundario col-4">
            Admin
          </Offcanvas.Title>
          <button
            className="col-3 fs-3"
            type="button"
            style={{ color: "#fff", background: "none", border: "none" }} // Aquí defines el color de la "X"
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
      </div>
    </>
  );
};

export default Layout;
