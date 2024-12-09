import { useEffect, useState } from "react";
import { exitSpecificQuery, errorSpecificQuery, errorGeneralQuery} from "../../../funciones";
import { useNavigate } from "react-router-dom";
import { getDestacamentos } from "../destacamentos/destacamentos";
import { capitalize } from "../../../funciones";
import { useSearchParams } from "react-router-dom";
import { getUserSession } from "../../lider/LayoutDest";

export const find_names_by_ids = (key, value, obj) => {
  if (key == "destacamento_id") {
    const result = obj.find((dest) => dest.id == value);
    return result ? result.nombre : null;
  } else if (key == "rol") {
    return value == 1 ? "Administrador" : "Usuario";
  }
};
const EditarUsuario = () => {
  const navigate = useNavigate();
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
          `http://erv-zona3/backend/users/actualizar?id=${id}`
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
          const query= await fetch('http://erv-zona3/backend/logs',{
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
        "http://erv-zona3/backend/users/actualizar",
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
      <form onSubmit={handleSubmit}>
      <label htmlFor="nombre">
          Nombre
          <input id="nombre"
            type="text"
            autoComplete="username"
            required
            value={data.nombre}
            name="nombre"
            placeholder="Escribe el nombre"
            onChange={handleOnchange}
          />
        </label>
        <label htmlFor="apellido">
          Apellido
          <input id="apellido"
            type="text"
            autoComplete="username"
            required
            value={data.apellido}
            name="apellido"
            placeholder="Escribe el apellido"
            onChange={handleOnchange}
          />
        </label>
        <label htmlFor="email">
          Email
          <input id="email"
            type="email"
            autoComplete="username"
            required
            value={data.email}
            name="email"
            placeholder="Tu Email"
            onChange={handleOnchange}
          />
        </label>
        <label htmlFor="destacamento_id">
          Destacamento
          <select
            id="destacamento_id"
            name="destacamento_id"
            required
            onChange={handleOnchange}
            value={data.destacamento_id}
          >
            <option value="">Selecciona un destacamento</option>
            {destacamentos &&
              destacamentos.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {capitalize(dest.nombre)}
                </option>
              ))}
          </select>
        </label>
        <label htmlFor="rol">
          Rol
          <select id="rol"
            name="rol"
            required
            onChange={handleOnchange}
            value={data.rol}
          >
            <option value="">Selecciona un rol</option>
            <option value="1">Administrador</option>
            <option value="2">Usuario</option>
          </select>
        </label>

        <button type="submit">Editar usuario</button>
      </form>
    </>
  );
};

export default EditarUsuario;
