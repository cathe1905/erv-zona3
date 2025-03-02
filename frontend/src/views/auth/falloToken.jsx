const FailedToken = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-4">
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
      <div className="container-xl text-center">
        <h4 className="fw-bold text-danger text-center mb-3">
          El enlace de recuperación ha expirado o no es válido.
        </h4>
        <p>
          Es posible que hayas usado un enlace antiguo o que hayan pasado más de
          30 minutos desde que lo recibiste. Por favor, solicita un nuevo enlace
          para restablecer tu contraseña.
        </p>
        <a href="/recuperar-contraseña" className="btn btn-primary mt-3">
          Solicitar cambio de contraseña
        </a>
      </div>
    </div>
  );
};

export default FailedToken;
