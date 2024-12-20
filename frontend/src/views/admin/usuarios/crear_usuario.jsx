import { useEffect, useState } from "react";
import {
  exitSpecificQuery,
  errorSpecificQuery,
  errorGeneralQuery,
} from "../../../funciones";
import { useNavigate } from "react-router-dom";
import { getDestacamentos } from "../destacamentos/destacamentos";
import { capitalize } from "../../../funciones";
import { getUserSession } from "../../lider/LayoutDest";
import { find_names_by_ids } from "./editar_usuario";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const CrearUsuario = () => {
  const navigate = useNavigate();
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
      log.admin_id !== "" ||
      log.action !== "" ||
      log.target_id !== "" ||
      log.details !== ""
    ) {
      const save_log = async () => {
        try {
          const query = await fetch("http://erv-zona3/backend/logs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(log_data_enviar),
          });
          if (query.ok) {
            exitSpecificQuery("Usuario guardado exitosamente");
            navigate("/dashboard/admin/usuarios");
          } else {
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
  }, [log]);

  useEffect(() => {
    if (id !== null) {
      evaluacion();
    }
  }, [id]);

  const get_id = async () => {
    try {
      const query = await fetch(
        `http://erv-zona3/backend/user/email?email=${data.email}`
      );
      if (query.ok) {
        const result = await query.json();
        return result;
      } else {
        const result = await query.json();
        const mensaje = result.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje);
      }
    } catch (error) {
      console.log(error);
      errorGeneralQuery();
    }
  };
  const evaluacion = () => {
    let detalles = "Se añadió la siguiente información: ";

    Object.entries(data).forEach(([key, value]) => {
      if (key != "contraseña") {
        if (key == "destacamento_id" || key == "rol") {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const respuesta = await fetch("http://erv-zona3/backend/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_enviar),
      });

      if (respuesta.ok) {
        const fetchId = async () => {
          const result = await get_id();
          setId(result.id);
        };
        fetchId();
      } else {
        const result = await respuesta.json();
        const mensaje = result.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje);
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
        className="container mt-4 p-4 rounded shadow-sm bg-light"
        style={{ maxWidth: '600px' }} 
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
                {destacamentos && destacamentos.map((dest) => (
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
    </>
  );
  
};

export default CrearUsuario;
