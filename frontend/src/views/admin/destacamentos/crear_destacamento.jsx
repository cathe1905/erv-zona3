import { useState } from "react";
import {
  errorGeneralQuery,
  errorSpecificQuery,
  exitSpecificQuery,
  api,
} from "../../../funciones";
import { useNavigate } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import GrowExample from "../../../components/GrowExample";

const CrearDestacamento = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    nombre: "",
    comandante_general: "",
    comandante_femenino: "",
    comandante_masculino: "",
    pastor: "",
    inst_pionero: "",
    inst_brijer: "",
    inst_bes: "",
    secretaria: "",
    tesorero: "",
    capellan: "",
    zona_id: "3",
  });

  const handleSubmit = async (e) => {
    setIsLoading(true)
    const datosParaEnviar = {
      destacamento: { ...data },
    };
    e.preventDefault();

    for (let item in data) {
      if (data[item] === "") {
        errorSpecificQuery("Todos los campos son obligatorios");
        return;
      }
    }
    try {
      const respuesta = await fetch(`${api}backend/destacamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosParaEnviar),
      });
      if (respuesta.ok) {
        setIsLoading(false)
        exitSpecificQuery("Destacamento guardado exitosamente");
        navigate("/dashboard/admin/destacamentos");
      } else {
        setIsLoading(false)
        const result = await respuesta.json();
        const mensaje = result.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje);
      }
    } catch (error) {
      console.log(error);
      errorGeneralQuery();
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '25rem'}}>
          {GrowExample()}
          <p className="mt-3">Espere un momento</p>
        </div>
      ) : (
      <form
        onSubmit={handleSubmit}
        className="container p-4 rounded shadow-sm bg-light"
        style={{ maxWidth: "600px" }}
      >
        <h2 className="text-center mb-4">Crea un nuevo Destacamento</h2>

        <div className="row gy-3">
          <div className="col-12">
            <FloatingLabel
              controlId="floatingNombre"
              label="Destacamento"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="nombre"
                value={data.nombre}
                onChange={handleChange}
                placeholder="Nombre del destacamento"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingComandanteGeneral"
              label="Comandante General"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="comandante_general"
                value={data.comandante_general}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingComandanteFemenino"
              label="Comandante Femenino"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="comandante_femenino"
                value={data.comandante_femenino}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingComandanteMasculino"
              label="Comandante Masculino"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="comandante_masculino"
                value={data.comandante_masculino}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingPastor"
              label="Pastor"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="pastor"
                value={data.pastor}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingInstPionero"
              label="Instructor Pionero"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="inst_pionero"
                value={data.inst_pionero}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingInstBrijer"
              label="Instructor Brijer"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="inst_brijer"
                value={data.inst_brijer}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingInstBes"
              label="Instructor BES"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="inst_bes"
                value={data.inst_bes}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingSecretaria"
              label="Secretaria"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="secretaria"
                value={data.secretaria}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingTesorero"
              label="Tesorero"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="tesorero"
                value={data.tesorero}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <FloatingLabel
              controlId="floatingCapellan"
              label="Capellán"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="capellan"
                value={data.capellan}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                required
              />
            </FloatingLabel>
          </div>

          <div className="col-12">
            <div className="d-grid">
              <button type="submit" className="btn btn-success">
                Guardar Destacamento
              </button>
            </div>
          </div>
        </div>
      </form>
       )}
    </>
  );
};

export default CrearDestacamento;
