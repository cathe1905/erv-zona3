/* eslint-disable react/prop-types */
import { Outlet} from "react-router-dom";
import { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { capitalize, getUserSession  } from "../../funciones";
import { useNavigate } from "react-router-dom";
import GrowExample from "../../components/GrowExample";

const Logout = () => {
  localStorage.removeItem("token");
  location.href = "/";
};

const Menu = ({ destacamento }) => {
  return (
    <>
      <nav className="row d-flex flex-column roboto-regular text-white mx-md-2">
        <a
          className="text-decoration-none mb-3 px-md-3 enlace-menu text-white"
          href={`/dashboard/dest?destacamento=${destacamento.destacamento}`}
        >
          <i className="bi bi-house-door me-2"></i> <span>Home</span>
        </a>
        <a
          className="text-decoration-none text-white enlace-menu mb-3 px-md-3"
          href={`/dashboard/dest/explo?destacamento=${destacamento.destacamento}`}
        >
          <i className="bi bi-people me-2"></i> <span>Exploradores</span>
        </a>

        <a
          type="button"
          onClick={Logout}
          className="text-decoration-none text-white roboto-regular fs-6 mt-5 enlace-menu px-md-3"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          <span>Cerrar sesión</span>
        </a>
      </nav>
    </>
  );
};

const LayoutDest = () => {
  const [show, setShow] = useState(false);
  const [destacamento, setDestacamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getUserSession();
    if (!data) {
      navigate("/");
    } 
      setDestacamento(data); 
    
    setLoading(false); 
  }, [navigate]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getTitulo = () => {
    switch (location.pathname) {
      case "/dashboard/dest":
        return "Bienvenido";
      case "/dashboard/dest/explo":
        return "Exploradores";
        case "/dashboard/dest/explo/crear":
        return "Exploradores";
      default:
        return "";
    }
  };

  if (loading)
    return (
      <div className="text-center">
      <table>
        <tbody>
          <tr>
            <td colSpan="12">
              {GrowExample()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    );

  return (
    <>
      {/* Dashboard tamaño desktop */}
      <div className="d-none d-md-flex">
        <div className="col-md-2 fondo-menu altura-completa">
          <h1 className="titulo_principal text-white px-4 py-3 mt-4">
            Dashboard
          </h1>
          <Menu destacamento={destacamento} />
        </div>
        <div className="col-md-10 p-md-4 margen">
          <div className="d-flex flex-row justify-content-between mx-md-3 my-md-2">
            <h1 className="d-none d-md-block titulo_principal text-start">
              {getTitulo()}
            </h1>
            <div className="d-flex justify-content-center align-items-center">
              <i className="bi bi-person me-2 fs-4 rounded-circle bg-secondary px-2"></i>
              <div>
                <p className="my-md-0 p-0 fw-bold letra_muy_pequeña">
                  {capitalize(destacamento.destacamento)}
                </p>
                <p className="my-md-0 letra_muy_pequeña">
                  {destacamento.email}
                </p>
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
              <p className="my-0 p-0 fw-bold letra_muy_pequeña">
                {capitalize(destacamento.destacamento)}
              </p>
              <p className="my-0 letra_muy_pequeña">{destacamento.email}</p>
            </div>
          </div>
        </div>
        <h1 className="d-md-none mx-4 mt-4 titulo_principal_mobile text-start">
          {getTitulo()}
        </h1>

        <Offcanvas
          className="d-md-none p-3 fondo-menu"
          show={show}
          onHide={handleClose}
          responsive="md"
        >
          <Offcanvas.Header className="row justify-content-between">
            <Offcanvas.Title className="text-white titulo_secundario col-4 fs-4">
              {capitalize(destacamento.destacamento)}
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
            <Menu destacamento={destacamento} />
          </Offcanvas.Body>
        </Offcanvas>
        <div className="py-1">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
};

export default LayoutDest;
