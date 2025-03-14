import { useState } from "react";
import { useEffect } from "react";
import { capitalize } from "../../../funciones";
import {errorGeneralQuery, errorSpecificQuery, exitSpecificQuery, api, getDestacamentos, getAscensos} from "../../../funciones";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import GrowExample from "../../../components/GrowExample";

const EditarDirectiva = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [params, setParams] = useSearchParams();
  const id = parseInt(params.get("id"), 10) || null;
  const [destacamentos, setDestacamentos] = useState(null);
  const [ascensos, setAscensos] = useState(null);
  const [newPhoto, setNewPhoto] = useState(false);
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
        setData((data) => ({
          ...data,
          foto: base64Image,
        }));
        setNewPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true)
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
      const result = await fetch(
        `${api}backend/directiva/actualizar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data_enviar),
        }
      );

      if (result.ok) {
        setIsLoading(false)
        exitSpecificQuery("Directivo actualizado exitosamente");
        navigate("/dashboard/admin/directiva");
      } else {
        setIsLoading(false)
        const resultado = await result.json();
        const mensaje = resultado.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje);
      }
    } catch (error) {
      console.error(error);
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
    const get_directivo_db = async () => {
      try {
        const result = await fetch(
          `${api}backend/directiva/actualizar?id=${id}`
        );
        if (result.ok) {
          const respuesta = await result.json();
          setData((data) => ({
            ...data,
            ...respuesta,
          }));
        } else {
          const resultado = await result.json();
          const mensaje = resultado.error || "Error al procesar la solicitud.";
          errorSpecificQuery(mensaje);
        }
      } catch (error) {
        console.error(error);
        errorGeneralQuery();
      }
    };
    get_directivo_db();

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
  }, [id]);

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
        className="container mt-0 mt-md-4 p-4 rounded shadow-sm bg-light"
        style={{ maxWidth: '600px' }}
      >
        <h2 className="text-center mb-4">Editar miembro</h2>
  
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
                onChange={handleChange} 
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
                onChange={handleChange} 
                placeholder="Apellidos" 
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
                onChange={handleChange} 
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
              controlId="floatingCargo"
              label="Cargo"
              className="mb-3"
            >
              <Form.Control 
                type="text" 
                name="cargo" 
                value={data.cargo} 
                onChange={handleChange} 
                placeholder="Cargo" 
                required 
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
                type="text" 
                name="telefono" 
                value={data.telefono} 
                onChange={handleChange} 
                placeholder="Teléfono" 
                required 
              />
            </FloatingLabel>
          </div>
  
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
                onChange={handleChange} 
                required
              >
                <option value="">Seleccione un destacamento</option>
                {destacamentos &&
                  destacamentos.map((destacamento) => (
                    <option key={destacamento.id} value={destacamento.id}>
                      {capitalize(destacamento.nombre)}
                    </option>
                  ))}
              </Form.Control>
            </FloatingLabel>
          </div>
  
          {!newPhoto && (
            <div className="col-12 text-center">
              <p>Foto actual</p>
              <img
                src={`${api}imagenes/${data.foto}`}
                alt="foto miembro"
                className="img-thumbnail"
                style={{width: '200px'}}
              />
            </div>
          )}
  
          <div className="col-12">
            <label htmlFor="foto" className="mb-3">
              Cambia tu foto (opcional)
              <input
                id="foto"
                type="file"
                accept="image/*"
                name="foto"
                onChange={handleFileChange}
                className="form-control"
              />
            </label>
          </div>
  
          <div className="col-12">
            <div className="d-grid">
              <button type="submit" className="btn btn-success">
                Editar Directivo
              </button>
            </div>
          </div>
        </div>
      </form>
       )}
    </>
  );
  
};

export default EditarDirectiva;
