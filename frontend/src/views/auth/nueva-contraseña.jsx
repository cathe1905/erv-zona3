import { BiShow, BiHide } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  errorGeneralQuery,
  errorSpecificQuery,
  api,
  exitSpecificQuery,
} from "../../funciones";
import { useSearchParams } from "react-router-dom";

const IngresarNuevaContraseña = () => {
  // eslint-disable-next-line no-unused-vars
  const [loged, setLoged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [params, setParams] = useSearchParams();
  const token = params.get("token");
  const [data, setData] = useState({
    token: "",
    password: "",
  });

  useEffect(() => {
    if (!token) {
      errorSpecificQuery("Enlace no disponible");
      navigate("/");
      return;
    }

    const isTokenValid = async () => {
      try {
        const query = await fetch(
          `${api}backend/user/is-token-valid?token=${token}`
        );

        const data = await query.json();

        if (!query.ok) {
          errorSpecificQuery(data.error);
          navigate("/");
        }
        setData((prevData) => ({
          ...prevData,
          token: token,
        }));
      } catch (error) {
        console.log(error);
        errorGeneralQuery();
      }
    };
    isTokenValid();
  }, [navigate, token]);


  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  
  const sendNewPassword = async (e) => {
    e.preventDefault();

    try {
      const query = await fetch(`${api}backend/password-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const respuesta = await query.json();
        if (query.ok) {
          exitSpecificQuery(respuesta.mensaje);
          navigate('/')
        } else {
          errorSpecificQuery(respuesta.error);
        }
    } catch (error) {
      console.log(error);
      errorGeneralQuery();
    }
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
                id="password"
                name="password"
                className="form-control"
                value={data.password}
                onChange={handleOnchange}
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
