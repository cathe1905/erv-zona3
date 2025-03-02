import { useEffect, useState, useCallback } from "react";
import {
  exitSpecificQuery,
  errorSpecificQuery,
  errorGeneralQuery,
  getDestacamentos,
} from "../../../funciones";
import { useNavigate } from "react-router-dom";
import { capitalize, api, find_names_by_ids } from "../../../funciones";
import { getUserSession } from "../../../funciones";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import GrowExample from "../../../components/GrowExample";

const CrearUsuario = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [logSent, setLogSent] = useState(false);
  const [destacamentos, setDestacamentos] = useState(null);
  const [data, setData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
    rol: "",
    destacamento_id: "",
  });
  const [log, setLog] = useState({
    admin_id: "",
    action: "",
    target_id: "",
    details: "",
  });
  const [idUserSession, setIdUserSession] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchDestacamentos = async () => {
      const result = await getDestacamentos();
      setDestacamentos(result);
    };
    fetchDestacamentos();

    const dataUserSession = getUserSession();
    setIdUserSession(dataUserSession.id);
  }, []);

  useEffect(() => {
    const log_data_enviar = {
      log: { ...log },
    };
    if (
      !logSent &&
      log.admin_id &&
      log.action &&
      log.target_id &&
      log.details
    ) {
      setLogSent(true);
      const save_log = async () => {
        try {
          const query = await fetch(`${api}backend/logs`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(log_data_enviar),
          });
          if (query.ok) {
            setIsLoading(false)
            exitSpecificQuery("Usuario guardado exitosamente");
            navigate("/dashboard/admin/usuarios");
          } else {
            setIsLoading(false)
            const result = await query.json();
            const mensaje = result.error || "Error al procesar la solicitud.";
            errorSpecificQuery(mensaje);
          }
        } catch (error) {
          console.log(error);
          errorGeneralQuery();
        }
      };
      save_log();
    }
  }, [log, navigate, logSent]);

  const evaluacion = useCallback(() => {
    let detalles = "Se añadió la siguiente información: ";

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "contraseña") {
        if (key === "destacamento_id" || key === "rol") {
          const result = find_names_by_ids(key, value, destacamentos);
          detalles += `${key}: ${result} `;
        } else {
          detalles += `${key}: ${value} `;
        }
      }
    });

    setLog({
      ...log,
      admin_id: idUserSession,
      action: "Creación de un nuevo usuario",
      target_id: id,
      details: detalles,
    });
  }, [data, destacamentos, idUserSession, id, log]);

  useEffect(() => {
    if (id !== null) {
      evaluacion();
    }
  }, [id, evaluacion]);

  const get_id = async () => {
    try {
      const query = await fetch(`${api}backend/user/email?email=${data.email}`);
      if (query.ok) {
        const result = await query.json();
        return result;
      } else {
        const result = await query.json();
        const mensaje = result.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje);
        return null;
      }
    } catch (error) {
      console.log(error);
      errorGeneralQuery();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data_enviar = {
      usuario: { ...data },
    };

    for (let item in data) {
      if (data[item] === "") {
        errorSpecificQuery("Todos los campos son obligatorios");
        return;
      }
    }
    try {
      const respuesta = await fetch(`${api}backend/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_enviar),
      });

      let resultado = null;
      try {
        resultado = await respuesta.json(); 
      } catch (jsonError) {
        console.warn("La respuesta no es JSON válido:", jsonError);
      }

      if (respuesta.ok) {
        const result = await get_id();
        if (result && result.id) {
          setId(result.id); 
        } else {
          errorSpecificQuery("No se pudo obtener el ID del usuario creado.");
          navigate("/dashboard/admin/usuarios");
        }
      } else {

        errorSpecificQuery(
          resultado?.errores || "Error al procesar la solicitud."
        );
      }
    } catch (error) {
      console.log(error);
      errorGeneralQuery();
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
     
        <form
          onSubmit={handleSubmit}
          className="container mt-0 mt-md-4 p-4 rounded shadow-sm bg-light"
          style={{ maxWidth: "600px" }}
        >
          <h2 className="text-center mb-4">Crear un nuevo Usuario</h2>

          <div className="row gy-3">
            {/* Campo Nombre */}
            <div className="col-12">
              <FloatingLabel
                controlId="floatingNombre"
                label="Nombre"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="nombre"
                  value={data.nombre}
                  onChange={handleOnchange}
                  placeholder="Escribe el nombre"
                  required
                />
              </FloatingLabel>
            </div>

            {/* Campo Apellido */}
            <div className="col-12">
              <FloatingLabel
                controlId="floatingApellido"
                label="Apellido"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="apellido"
                  value={data.apellido}
                  onChange={handleOnchange}
                  placeholder="Escribe el apellido"
                  required
                />
              </FloatingLabel>
            </div>

            {/* Campo Email */}
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
                  placeholder="Escribe el email"
                  required
                />
              </FloatingLabel>
            </div>

            {/* Campo Destacamento */}
            <div className="col-12">
              <FloatingLabel
                controlId="floatingDestacamento"
                label="Destacamento"
                className="mb-3"
              >
                <Form.Control
                  as="select"
                  name="destacamento_id"
                  value={data.destacamento_id}
                  onChange={handleOnchange}
                  required
                >
                  <option value="">Selecciona un destacamento</option>
                  {destacamentos &&
                    destacamentos.map((dest) => (
                      <option key={dest.id} value={dest.id}>
                        {capitalize(dest.nombre)}
                      </option>
                    ))}
                </Form.Control>
              </FloatingLabel>
            </div>

            {/* Campo Contraseña */}
            <div className="col-12">
              <FloatingLabel
                controlId="floatingContraseña"
                label="Contraseña"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  name="contraseña"
                  value={data.contraseña}
                  onChange={handleOnchange}
                  placeholder="Tu contraseña"
                  required
                />
              </FloatingLabel>
            </div>

            {/* Campo Rol */}
            <div className="col-12">
              <FloatingLabel
                controlId="floatingRol"
                label="Rol"
                className="mb-3"
              >
                <Form.Control
                  as="select"
                  name="rol"
                  value={data.rol}
                  onChange={handleOnchange}
                  required
                >
                  <option value="">Selecciona un rol</option>
                  <option value="1">Administrador</option>
                  <option value="2">Usuario</option>
                </Form.Control>
              </FloatingLabel>
            </div>

            {/* Botón de Enviar */}
            <div className="col-12">
              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  Guardar Usuario
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CrearUsuario;
