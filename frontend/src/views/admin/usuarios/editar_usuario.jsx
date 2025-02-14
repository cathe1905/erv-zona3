import { useEffect, useState } from "react";
import { exitSpecificQuery, errorSpecificQuery, errorGeneralQuery} from "../../../funciones";
import { useNavigate } from "react-router-dom";
import { getDestacamentos } from "../destacamentos/destacamentos";
import { capitalize, api, find_names_by_ids } from "../../../funciones";
import { useSearchParams } from "react-router-dom";
import { getUserSession } from "../../../funciones";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


const EditarUsuario = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [params, setParams] = useSearchParams();
  const id = parseInt(params.get("id"), 10) || null;
  const [destacamentos, setDestacamentos] = useState(null);
  const [data, setData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    email: "",
    rol: "",
    destacamento_id: "",
  });
  const [oldData, setOldData] = useState({
    email: "",
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

  useEffect(() => {
    const fetchDestacamentos = async () => {
      const result = await getDestacamentos();
      setDestacamentos(result);
    };
    fetchDestacamentos();
    const getUserById = async () => {
      try {
        const query = await fetch(
          `${api}backend/users/actualizar?id=${id}`
        );
        if (query.ok) {
          const result = await query.json();
          setData({
            ...data,
            nombre: result.nombre,
            apellido: result.apellido,
            id: result.id,
            email: result.email,
            rol: result.rol,
            destacamento_id: result.destacamento_id,
          });
          setOldData({
            nombre: result.nombre,
            apellido: result.apellido,
            email: result.email,
            rol: result.rol,
            destacamento_id: result.destacamento_id,
          });
        }else{
          const result = await query.json();
          const mensaje= result.error || "Error al procesar la solicitud.";
          errorSpecificQuery(mensaje)
        }
      } catch (error) {
        console.log(error);
        errorGeneralQuery();
      }
    };
    getUserById();
    const dataUserSession = getUserSession();
    setIdUserSession(dataUserSession.id);
  }, []);

  useEffect(() => {
    if (log.admin_id !== "" || log.action !== "" || log.target_id !== "" || log.details !== "") {
      const log_data_enviar= {
        log: {...log}
      }
      const save_log= async () =>{
        try{
          const query= await fetch(`${api}backend/logs`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(log_data_enviar),
          })
          if (query.ok) {
            exitSpecificQuery('Usuario actualizado exitosamente')
            navigate("/dashboard/admin/usuarios");
          }else{
            const result = await query.json();
            const mensaje= result.error || "Error al procesar la solicitud.";
            errorSpecificQuery(mensaje)
          }
        } catch (error) {
          console.log(error);
          errorGeneralQuery();
        }
      }
      save_log();
    }
  }, [log]);

  const evaluacionCambios = () => {
    let cambiosNuevos = {};
    let cambiosAnteriores = {};
    let detalles = "Se cambiaron estos campos: ";
    let textoOld = "";
    let textoNew = "";

    Object.keys(oldData).forEach((key) => {
      if (oldData[key] !== data[key]) {
        cambiosNuevos[key] = data[key];
        cambiosAnteriores[key] = oldData[key];
      }
    });

    Object.entries(cambiosAnteriores).forEach(([key, value]) => {
      if (key == "destacamento_id" || key == "rol") {
        const result = find_names_by_ids(key, value, destacamentos);
        textoOld += `${key}: ${result} `;
      } else {
        textoOld += `${key}: ${value} `;
      }
    });

    detalles += textoOld + "por los siguientes: ";

    Object.entries(cambiosNuevos).forEach(([key, value]) => {
      if (key == "destacamento_id" || key == "rol") {
        const result = find_names_by_ids(key, value, destacamentos);
        textoNew += `${key}: ${result} `;
      } else {
        textoNew += `${key}: ${value} `;
      }
    });

    detalles += textoNew;
    setLog({
      ...log,
      admin_id: idUserSession,
      action: "Actualizacion de usuario",
      target_id: data.id,
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
        errorSpecificQuery('Todos los campos son obligatorios')
        return;
      }
    }
    try {
      const respuesta = await fetch(
        `${api}backend/users/actualizar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data_enviar),
        }
      );

      if (respuesta.ok) {
        evaluacionCambios();
      }else{
        const result = await respuesta.json();
        const mensaje= result.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje)
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
        <h2 className="text-center mb-4">Editar Usuario</h2>
  
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
                placeholder="Tu Email"
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
                Editar Usuario
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
  
};

export default EditarUsuario;
