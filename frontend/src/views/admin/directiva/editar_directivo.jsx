import { useState } from "react";
import { useEffect } from "react";
import { getDestacamentos } from "../destacamentos/destacamentos";
import { getAscensos } from "../ascensos/ascensos";
import { capitalize } from "../../../funciones";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const EditarDirectiva =() =>{
  const navigate = useNavigate(); 
  const [params, setParams]= useSearchParams();
  const id= parseInt(params.get('id'),10) || null;
  const [destacamentos, setDestacamentos] = useState(null);
  const [ascensos, setAscensos] = useState(null);
  const [newPhoto, setNewPhoto]= useState(false);
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
        setData((data )=>({
          ...data,
          foto: base64Image,
        }));
        setNewPhoto(true)

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
            Swal.fire({
            title: "Error!",
            text: "Todos los campos son obligatorios",
            icon: "error",
            confirmButtonText: "Revisar",
            });
            return;
        }
        }
        try{
        const result = await fetch("http://erv-zona3/backend/directiva/actualizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data_enviar),
        });

        if (result.ok) {
        Swal.fire({
            title: "Exito",
            text: "Directivo zonal editado exitosamente",
            icon: "success",
            confirmButtonText: "Ok",
        });
        navigate("/dashboard/admin/directiva");
        }
        }catch(error){
            console.error(error);
            console.log('Error al editar del miembro a editar')
        }
    
    }
    const handleChange = (e) => {
      const { name, value } = e.target;
      setData({
        ...data,
        [name]: value,
      });
    };

    useEffect(() => {
        const get_directivo_db= async () =>{
            try{
                const result= await fetch(`http://erv-zona3/backend/directiva/actualizar?id=${id}`);
                if(result.ok){
                    const respuesta= await result.json();
                    setData(data =>({
                        ...data,
                        ...respuesta
                    }))
                }
            }catch(error){
                console.error(error);
                console.log('Error en la consulta del miembro a editar')
            }
        
        }
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
  console.log(data)
  return (
    <>
    <h2>Editar miembro</h2>
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
        <select name="ascenso_id" onChange={handleChange} required value={data.ascenso_id}>
          <option value="">Seleccione un ascenso</option>
          {ascensos &&
            ascensos.map((ascenso) => (
              <option key={ascenso.id} value={ascenso.id}>{capitalize(ascenso.nombre)}</option>
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
      
        <select name="destacamento_id" onChange={handleChange} required value={data.destacamento_id}>
          <option value="">Seleccione un destacamento</option>
          {destacamentos &&
            destacamentos.map((destacamento) => (
              <option key={destacamento.id} value={destacamento.id} >
                {capitalize(destacamento.nombre)}
              </option>
            ))}
        </select>
        {!newPhoto &&(
                    <div>
                    <p>Foto actual</p>
                    <img src={`http://erv-zona3/imagenes/${data.foto}`} alt="foto miembro" />
                </div>
        )}

        <label>
          Cambia tu foto (opcional)
          <input
            type="file"
            accept="image/*"
            name="foto"
            onChange={handleFileChange}
          />
        </label>
        <button type="submit">Editar Directivo</button>
      </form>
    </>
  );
};

export default EditarDirectiva
