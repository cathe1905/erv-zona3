import { useEffect, useState } from "react";
import {
  errorGeneralQuery,
  errorSpecificQuery,
  exitSpecificQuery,
  api,
  capitalize,
} from "../../../funciones";
import { useNavigate } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import GrowExample from "../../../components/GrowExample";
import { useExplo } from "../../../hook/useExplo";

const CrearExplorador = () => {
  const {state} = useExplo()
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ascensos, setAscensos] = useState(null);
  const [idDestacamento, setIdDestacamento] = useState("");
  const [destacamento, setDestacamento] = useState("");
  const [data, setData] = useState({
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    ascenso_id: "",
    fecha_promesacion: "",
    cargo: "",
    cedula: "",
    telefono: "",
    email: "",
    destacamento_id: "",
  });

  useEffect(() => {
    if (state.user_info) {
      setIdDestacamento(state.user_info.destacamento_id);
      setDestacamento(state.user_info.destacamento);
    }
  }, [state.user_info]);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      destacamento_id: idDestacamento,
    }));
  }, [idDestacamento]);

  useEffect(() => {
    if(state.ascensos)
      setAscensos(state.ascensos);
  }, [state.ascensos]);

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    const data_enviar = {
      explorador: { ...data },
    };

    for (let item in data) {
      //estos campos no son obligatorios
      if (item !== "cargo" && item !== "cedula" && item !== "email") {
        if (data[item] == "") {
          errorSpecificQuery("Algún campo obligatorio esta vacío");
          return;
        }
      }
    }
    try {
      const respuesta = await fetch(`${api}backend/explo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_enviar),
      });

      if (respuesta.ok) {
        exitSpecificQuery("Explorador creado exitosamente");
        navigate(`/dashboard/dest/explo?destacamento=${destacamento}`);
      } else {
        const result = await respuesta.json();
        const mensaje = result.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje);
      }
    } catch (error) {
      console.log(error);
      errorGeneralQuery();
    }finally{
      setIsLoading(false)
    }
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
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
        <form
          onSubmit={handleSubmit}
          className="container mt-0 mt-md-4 p-4 rounded shadow-sm bg-light"
          style={{ maxWidth: "600px" }}
        >
          <h2 className="text-center mb-4">Crear nuevo explorador</h2>

          <div className="row gy-3">
            <div className="col-12">
              <FloatingLabel
                controlId="floatingNombres"
                label="Nombres"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="nombres"
                  value={data.nombres}
                  onChange={handleOnchange}
                  placeholder="Nombres"
                  required
                />
              </FloatingLabel>
            </div>

            <div className="col-12">
              <FloatingLabel
                controlId="floatingApellidos"
                label="Apellidos"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="apellidos"
                  value={data.apellidos}
                  onChange={handleOnchange}
                  placeholder="Apellidos"
                  required
                />
              </FloatingLabel>
            </div>

            <div className="col-12">
              <FloatingLabel
                controlId="floatingFechaNacimiento"
                label="Fecha de Nacimiento"
                className="mb-3"
              >
                <Form.Control
                  type="date"
                  name="fecha_nacimiento"
                  value={data.fecha_nacimiento}
                  onChange={handleOnchange}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </FloatingLabel>
            </div>

            <div className="col-12">
              <FloatingLabel
                controlId="floatingAscenso"
                label="Ascenso"
                className="mb-3"
              >
                <Form.Control
                  as="select"
                  name="ascenso_id"
                  value={data.ascenso_id}
                  onChange={handleOnchange}
                  required
                >
                  <option value="">Seleccione un ascenso</option>
                  {ascensos &&
                    ascensos.map((ascenso) => (
                      <option key={ascenso.id} value={ascenso.id}>
                        {capitalize(ascenso.nombre)}
                      </option>
                    ))}
                </Form.Control>
              </FloatingLabel>
            </div>

            <div className="col-12">
              <FloatingLabel
                controlId="floatingFechaPromesacion"
                label="Fecha de Promesación"
                className="mb-3"
              >
                <Form.Control
                  type="date"
                  name="fecha_promesacion"
                  value={data.fecha_promesacion}
                  onChange={handleOnchange}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </FloatingLabel>
            </div>

            <div className="col-12">
              <FloatingLabel
                controlId="floatingCargo"
                label="Cargo"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="cargo"
                  value={data.cargo}
                  onChange={handleOnchange}
                  placeholder="Cargo"
                />
              </FloatingLabel>
            </div>

            <div className="col-12">
              <FloatingLabel
                controlId="floatingCedula"
                label="Cédula"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="cedula"
                  value={data.cedula}
                  onChange={handleOnchange}
                  placeholder="Cédula"
                />
              </FloatingLabel>
            </div>

            <div className="col-12">
              <FloatingLabel
                controlId="floatingTelefono"
                label="Teléfono"
                className="mb-3"
              >
                <Form.Control
                  type="number"
                  name="telefono"
                  value={data.telefono}
                  onChange={handleOnchange}
                  placeholder="Teléfono"
                  required
                />
              </FloatingLabel>
            </div>

            <div className="col-12">
              <FloatingLabel
                controlId="floatingEmail"
                label="Email"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnchange}
                  placeholder="Email"
                />
              </FloatingLabel>
            </div>

            <div className="col-12">
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Crear explorador
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};
export default CrearExplorador;
