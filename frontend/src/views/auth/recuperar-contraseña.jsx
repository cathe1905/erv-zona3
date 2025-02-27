const RecuperarContraseña = () => {
    const sendRequest = () =>{

    }
  return (
    <div className="fondo-login">
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 sombra login-container ">
        <form
          onSubmit={sendRequest}
          className="card py-5 px-4 shadow-lg sombra2"
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
          <h2 className="text-center mb-4">Recupera tu contraseña</h2>
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
          
          <button type="submit" className="btn btn-success w-100">
            Enviar enlace de recuperación
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

export default RecuperarContraseña;
