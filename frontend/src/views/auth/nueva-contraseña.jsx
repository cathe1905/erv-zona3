import { BiShow, BiHide } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { getUserSession } from "../../funciones";
// import { errorGeneralQuery, errorSpecificQuery, api } from "../../funciones";

const IngresarNuevaContraseña = () => {
  // eslint-disable-next-line no-unused-vars
  const [loged, setLoged] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);
  const navigate = useNavigate();

  const sendNewPassword = (e) => {
    e.preventDefault();
  };

  return (
    <div className="fondo-login">
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 sombra login-container">
        <form
          onSubmit={sendNewPassword}
          className="card py-3 px-4 shadow-lg sombra2"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="text-center mb-3">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="rounded-circle mb-2"
              style={{ width: "80px", height: "80px" }}
            />
            <p className="fw-bold">
              Exploradores del Rey de Venezuela
              <br />
              Zona 3
            </p>
          </div>
          <h2 className="text-center mb-4">Ingresa tu nueva contraseña</h2>

          <div className="mb-4">
            <label htmlFor="contraseña" className="form-label">
              Contraseña
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="contraseña"
                name="contraseña"
                className="form-control"
                placeholder="Tu Contraseña"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="contraseña" className="form-label">
              Confirma tu Contraseña
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="contraseña"
                name="contraseña"
                className="form-control"
                placeholder="Tu Contraseña"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPasswordConf(!showPasswordConf)}
              >
                {showPasswordConf ? <BiHide /> : <BiShow />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Guardar nueva contraseña
          </button>
        </form>
        <footer className="mt-4 text-center">
          <p className="text-muted letra_muy_pequeña">
            © {new Date().getFullYear()} E.R.V Zona 3, Desarrollado por:{" "}
            <span>
              <a
                className="bw-bold fw-bold text-decoration-underline text-muted fst-italic"
                href="https://personal-portfolio-eta-ashy.vercel.app/"
              >
                Catherin Romero
              </a>
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default IngresarNuevaContraseña;
