const SuccessVerification = () => {
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
      <h4 className="fw-bold text-center">Tu cuenta ha sido verificada correctamente.</h4>
      <a href="/" className="btn btn-primary mt-3">
        Iniciar sesión
      </a>
    </div>
  );
};

const FailedVerification = () => {
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
      <h4 className="fw-bold text-danger text-center">
        La verificación de tu cuenta falló,
      </h4>
      <h4 className="fw-bold text-danger text-center">
        Por favor, contacta al administrador.
      </h4>
    </div>
  );
};

export { SuccessVerification, FailedVerification };
