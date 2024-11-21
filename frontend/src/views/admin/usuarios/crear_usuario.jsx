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
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">
          Nombre
          <input
            id="nombre"
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
          <input
            id="apellido"
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
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={data.email}
            name="email"
            placeholder="Escribe el email"
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
        <label htmlFor="contraseña">
          Contraseña
          <input
            id="contraseña"
            type="password"
            autoComplete="current-password"
            name="contraseña"
            placeholder="Tu contraseña"
            onChange={handleOnchange}
            required
          />
        </label>
        <label htmlFor="rol">
          Rol
          <select id="rol" name="rol" required onChange={handleOnchange}>
            <option value="">Selecciona un rol</option>
            <option value="1">Administrador</option>
            <option value="2">Usuario</option>
          </select>
        </label>

        <button type="submit">Guardar usuario</button>
      </form>
    </>
  );
};

export default CrearUsuario;
