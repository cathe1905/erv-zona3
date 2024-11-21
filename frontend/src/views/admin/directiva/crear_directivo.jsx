import { useState } from "react";
import { useEffect } from "react";
import { getDestacamentos } from "../destacamentos/destacamentos";
import { getAscensos } from "../ascensos/ascensos";
import { capitalize } from "../../../funciones";
import {
  errorGeneralQuery,
  errorSpecificQuery,
  errorSpecificQuery,
} from "../../../funciones";
import { useNavigate } from "react-router-dom";

const CrearDirectiva = () => {
  const navigate = useNavigate();
  const [destacamentos, setDestacamentos] = useState(null);
  const [ascensos, setAscensos] = useState(null);
  const [data, setData] = useState({
    nombres: "",
    apellidos: "",
    ascenso_id: "",
    cargo: "",
    telefono: "",
    foto: "",
    destacamento_id: "",
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setData({
          ...data,
          foto: base64Image,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data_enviar = {
      directiva: { ...data },
    };

    for (let item in data) {
      if (data[item] === "") {
        errorSpecificQuery("Todos los campos son obligatorios");
        return;
      }
    }
    try {
      const result = await fetch("http://erv-zona3/backend/directiva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_enviar),
      });

      if (result.ok) {
        exitSpecificQuery('Directivo guardado exitosamente')
        navigate("/dashboard/admin/directiva");
      }else{
        const resultado = await result.json();
        const mensaje= resultado.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje)
      }
    } catch (error) {
      console.log(error)
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

  useEffect(() => {
    const fetch_destacamento = async () => {
      const result = await getDestacamentos();
      setDestacamentos(result);
    };
    fetch_destacamento();

    const fetch_ascensos = async () => {
      const result = await getAscensos();
      setAscensos(result);
    };
    fetch_ascensos();
  }, []);

  return (
    <>
      <h2>Crear nuevo miembro</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            name="nombres"
            value={data.nombres}
            onChange={handleChange}
            placeholder="Nombres"
            required
          />
        </label>

        <label>
          <input
            type="text"
            name="apellidos"
            value={data.apellidos}
            onChange={handleChange}
            placeholder="Apellidos"
            required
          />
        </label>
        <select name="ascenso_id" onChange={handleChange} required>
          <option value="">Seleccione un ascenso</option>
          {ascensos &&
            ascensos.map((ascenso) => (
              <option key={ascenso.id} value={ascenso.id}>
                {capitalize(ascenso.nombre)}
              </option>
            ))}
        </select>
        <label>
          <input
            type="text"
            name="cargo"
            value={data.cargo}
            onChange={handleChange}
            placeholder="Cargo"
            required
          />
        </label>
        <label>
          <input
            type="text"
            name="telefono"
            value={data.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            required
          />
        </label>
        <label>
          Selecciona una Foto
          <input
            type="file"
            accept="image/*"
            name="foto"
            onChange={handleFileChange}
            required
          />
        </label>
        <select name="destacamento_id" onChange={handleChange} required>
          <option value="">Seleccione un destacamento</option>
          {destacamentos &&
            destacamentos.map((destacamento) => (
              <option key={destacamento.id} value={destacamento.id}>
                {capitalize(destacamento.nombre)}
              </option>
            ))}
        </select>
        <button type="submit">Guardar Directivo</button>
      </form>
    </>
  );
};

export default CrearDirectiva;
