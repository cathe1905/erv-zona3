import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { errorGeneralQuery, errorSpecificQuery, api } from "../../funciones";
import { BiShow, BiHide } from "react-icons/bi";
import GrowExample from "../../components/GrowExample";
import 'react-toastify/dist/ReactToastify.css';
import { useExplo } from "../../hook/useExplo";


function LoginPage() {
  // eslint-disable-next-line no-unused-vars
  const [loged, setLoged] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

const {setUser} = useExplo()
  const logIn = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const datos = {
      email: e.target.email.value,
      contraseña: e.target.contraseña.value,
    };

    try {
      const respuesta = await fetch(`${api}backend/users/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      const data = await respuesta.json();
      if (respuesta.ok) {
        setIsLoading(false);
        setLoged(true);

        setUser(data.token)
        const data_decode = jwtDecode(data.token);

        if (data_decode.data.role == 1 || data_decode.data.role == 3 ) {
          navigate("/dashboard/admin");
        } 
         if (data_decode.data.role == 2) {
          navigate(
            `/dashboard/dest?destacamento=${data_decode.data.destacamento}`
          );
        }

      } else {
        setError("Error al iniciar sesión");
        errorSpecificQuery(data.error);
        return;
      }
    } catch (error) {
      console.error("Hubo un problema con la solicitud", error);
      setError("Hubo un problema con la solicitud");
      errorGeneralQuery();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: "25rem" }}
        >
          {GrowExample()}
          <p className="mt-3">Espere un momento</p>
        </div>
      ) : (
        <div className="fondo-login">
          <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 sombra login-container">
            <form
              onSubmit={logIn}
              className="card py-3 px-4 shadow-lg sombra2"
              style={{ maxWidth: "400px", width: "100%" }}
            >
              <div className="text-center mb-2">
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
              <button type="submit" className="btn btn-success w-100">
                Ingresar
              </button>
              <div className="text-center mt-3">
                <a
                  href="/recuperar-contraseña"
                  className="text-decoration-none"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </form>
            <footer className="mt-2 text-center">
              <p className="text-muted letra_muy_pequeña">
                © {new Date().getFullYear()} E.R.V Zona 3, Creado por:{" "}
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
      )}
    </>
  );
}

export default LoginPage;
