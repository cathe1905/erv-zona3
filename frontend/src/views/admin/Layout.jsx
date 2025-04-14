import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useEffect } from "react";
import { capitalize } from "../../funciones";
import { useNavigate } from "react-router-dom";
import { useExplo } from "../../hook/useExplo";
import Accordion from "react-bootstrap/Accordion";
import { NavLink } from "react-router-dom";

const Titulo = () => {
  const location = useLocation();
  switch (location.pathname) {
    case "/dashboard/admin":
      return "Bienvenido";
    case "/dashboard/admin/explo":
      return "Exploradores";
    case "/dashboard/admin/destacamentos":
      return "Destacamentos";
    case "/dashboard/admin/directiva":
      return "Directiva Zonal";
    case "/dashboard/admin/ascensos":
      return "Ascensos";
    case "/dashboard/admin/usuarios":
      return "Usuarios";
    case "/dashboard/admin/logs":
      return "Registro de Actividades de Administradores";
    case "/dashboard/admin/tesoreria/pagos":
      return "Listado de pagos y solvencias";
    case "/dashboard/admin/tesoreria/solicitudes":
      return "Listado de solicitudes de pagos";
      case "/dashboard/admin/tesoreria/solicitudes/crear":
      return "Crear solicitud de pago";
    default:
      return "";
  }
};

const Menu = () => {
  const { Logout } = useExplo();
  return (
    <>
      <nav className="row d-flex flex-column roboto-regular text-white mx-md-2">
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-decoration-none mb-3 px-md-3 enlace-menu text-white nav-link-active"
              : "text-decoration-none mb-3 px-md-3 enlace-menu text-white"
          }
          to="/dashboard/admin"
          end
        >
          <i className="bi bi-house-door me-2"></i> <span>Home</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-decoration-none mb-3 px-md-3 enlace-menu text-white nav-link-active"
              : "text-decoration-none mb-3 px-md-3 enlace-menu text-white"
          }
          to="/dashboard/admin/explo"
        >
          <i className="bi bi-people me-2"></i> <span>Exploradores</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-decoration-none mb-3 px-md-3 enlace-menu text-white nav-link-active"
              : "text-decoration-none mb-3 px-md-3 enlace-menu text-white"
          }
          to="/dashboard/admin/destacamentos"
        >
          <i className="bi bi-building me-2"></i> <span>Destacamentos</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-decoration-none mb-3 px-md-3 enlace-menu text-white nav-link-active"
              : "text-decoration-none mb-3 px-md-3 enlace-menu text-white"
          }
          to="/dashboard/admin/directiva"
        >
          <i className="bi bi-briefcase me-2"></i> <span>Directiva Zonal</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-decoration-none mb-3 px-md-3 enlace-menu text-white nav-link-active"
              : "text-decoration-none mb-3 px-md-3 enlace-menu text-white"
          }
          to="/dashboard/admin/ascensos"
        >
          <i className="bi bi-star me-2"></i> <span>Ascensos</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-decoration-none px-md-3 enlace-menu text-white nav-link-active"
              : "text-decoration-none px-md-3 enlace-menu text-white"
          }
          to="/dashboard/admin/usuarios"
        >
          <i className="bi bi-person me-2"></i> <span>Usuarios</span>
        </NavLink>
        <Accordion
          defaultActiveKey=""
          flush
          className="bg-transparent border-0 mt-0 px-0"
        >
          <Accordion.Item eventKey="0" className="bg-transparent border-0 m-0">
            <Accordion.Header className="custom-accordion-header mx-0">
              <i className="bi bi-cash-coin me-2"></i> <span>Tesorería</span>
            </Accordion.Header>
            <Accordion.Body className="py-0">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-decoration-none mb-2 px-md-3 enlace-menu text-white nav-link-active"
                    : "text-decoration-none mb-2 px-md-3 enlace-menu text-white"
                }
                to="/dashboard/admin/tesoreria/pagos"
              >
                Listado de Pagos
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-decoration-none mb-2 px-md-3 enlace-menu text-white nav-link-active"
                    : "text-decoration-none mb-2 px-md-3 enlace-menu text-white"
                }
                to="/dashboard/admin/tesoreria/solicitudes"
                end
              >
                Solicitudes
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-decoration-none px-md-3 enlace-menu text-white nav-link-active"
                    : "text-decoration-none px-md-3 enlace-menu text-white"
                }
                to="/dashboard/admin/tesoreria/solicitudes/crear"
              >
                Crear Solicitud
              </NavLink>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <a
          className="text-decoration-none my-3 text-white enlace-menu px-md-3 "
          href="/dashboard/admin/logs"
        >
          <i className="bi bi-search me-2"></i>{" "}
          <span>Actividades de Administradores</span>
        </a>

        <a
          type="button"
          onClick={Logout}
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
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useExplo();

  useEffect(() => {
    setAdmin(state.user_info);
  }, [state.user_info]);

  const retroceder = () => {
    navigate(-1);
  };

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
            {location.pathname !== "/dashboard/admin" ? (
              <div className="d-flex align-items-center gap-3">
                <a
                  onClick={retroceder}
                  className="fs-3 text-black cursor-pointer"
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-arrow-left-circle-fill"></i>
                </a>
                <h1 className="d-none d-md-block titulo_principal text-start">
                  {Titulo()}
                </h1>
              </div>
            ) : (
              <h1 className="d-none d-md-block titulo_principal text-start">
                {Titulo()}
              </h1>
            )}

            <div className="d-flex justify-content-center align-items-center">
              <i className="bi bi-person me-2 fs-4 rounded-circle bg-secondary px-2"></i>
              <div>
                <p className="my-md-0 p-0 fw-bold letra_muy_pequeña">
                  {admin
                    ? capitalize(admin.nombre) +
                      " " +
                      capitalize(admin.apellido)
                    : "Administrador"}
                </p>
                <p className="my-md-0 letra_muy_pequeña">
                  {admin ? admin.email : ""}
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
                {admin
                  ? capitalize(admin.nombre) + " " + capitalize(admin.apellido)
                  : "Administrador"}
              </p>
              <p className="my-0 letra_muy_pequeña">
                {admin ? admin.email : ""}
              </p>
            </div>
          </div>
        </div>
        {location.pathname !== "/dashboard/admin" ? (
          <div className="d-flex align-items-center gap-3 my-3">
            <a
              onClick={retroceder}
              className="fs-1 text-black cursor-pointer ms-3"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-arrow-left-circle-fill"></i>
            </a>
            <h1 className="d-md-none titulo_principal_mobile text-start mb-0">
              {Titulo()}
            </h1>
          </div>
        ) : (
          <h1 className="d-md-none mx-4 mt-4 titulo_principal_mobile text-start">
            {Titulo()}
          </h1>
        )}

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
