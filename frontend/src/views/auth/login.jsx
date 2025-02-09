import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUserSession } from "../lider/LayoutDest";
import { errorGeneralQuery, errorSpecificQuery, api } from "../../funciones";
import { BiShow, BiHide } from "react-icons/bi";

function LoginPage() {
  const [loged, setLoged] = useState(false);
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const logIn = async (e) => {
    e.preventDefault();
    const datos = {
      email: e.target.email.value,
      contraseña: e.target.contraseña.value,
    };

    try {
      const respuesta = await fetch(`${api}users/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (respuesta.ok) {
        setLoged(true);
        const data = await respuesta.json();
        localStorage.setItem("token", data.token);

        const data_decode = jwtDecode(data.token);

        if (data_decode.data.role == 1) {
          navigate("/dashboard/admin");
        } else if (data_decode.data.role == 2) {
          navigate(
            `/dashboard/dest?destacamento=${data_decode.data.destacamento}`
          );
        }
      } else {
        setError("Error al iniciar sesión");
        errorSpecificQuery("Contraseña o email incorrectos");
        return;
      }
    } catch (error) {
      console.error("Hubo un problema con la solicitud", error);
      setError("Hubo un problema con la solicitud");
      errorGeneralQuery();
    }
  };

  useEffect(() => {
    const evaluateUser = async () => {
      const user = await getUserSession();
      if (user) {
        if (user.role === 1) {
          navigate("/dashboard/admin");
        } else if (user.role === 2) {
          navigate(`/dashboard/dest?destacamento=${user.destacamento}`);
        }
      } else {
        console.log("no hay token");
      }
    };
    evaluateUser();
  }, [navigate]);

  return (
    <div className="fondo-login">
      <div
        className="container d-flex flex-column justify-content-center align-items-center min-vh-100 sombra login-container"
      >
        <form
          onSubmit={logIn}
          className="card p-4 shadow-lg sombra2"
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
          <h2 className="text-center mb-4">Ingresa a tu cuenta</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Tu Email"
                required
              />
            </div>
          </div>
          <div className="mb-3">
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
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Recordarme
            </label>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Ingresar
          </button>
          <div className="text-center mt-3">
            <a href="#" className="text-decoration-none">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
        <footer className="mt-4 text-center">
          <p className="text-muted">© {new Date().getFullYear()} E.R.V Zona 3. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

export default LoginPage;
