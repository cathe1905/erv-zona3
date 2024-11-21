import { getAscensos } from "../../admin/ascensos/ascensos"
import { useEffect, useState } from "react";
import { errorGeneralQuery, errorSpecificQuery, exitSpecificQuery } from "../../../funciones";
import { useNavigate } from "react-router-dom"
import { getUserSession } from "../LayoutDest";

const CrearExplorador =() =>{
    const navigate= useNavigate();
    const [error, setError] = useState(null);
    const [ascensos, setAscensos] = useState(null);
    const [idDestacamento, setIdDestacamento]= useState("");
    const [destacamento, setDestacamento] = useState("");
    const [data, setData] = useState({
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        ascenso_id: '',
        fecha_promesacion: '',
        cargo: '',
        cedula: '',
        telefono: '',
        email: '',
        destacamento_id: ''
    });

    useEffect(() =>{
        const userData= getUserSession();
        if(userData){
            setIdDestacamento(userData.destacamento_id);
            setDestacamento(userData.destacamento)
        }
      }, [])

      useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            destacamento_id: idDestacamento,
        }));
    }, [idDestacamento]);

      useEffect(() => {
        async function getdataAscensos() {
              const respuesta = await getAscensos();
              if(respuesta){
                setAscensos(respuesta);
              }else{
                setError("Error al cargar los ascensos");
              }
          }
          getdataAscensos();
      }, []);

    const handleSubmit= async (e) =>{
        e.preventDefault();
        const data_enviar= {
            explorador: {...data}
        }
        
        for(let item in data){
            //estos campos no son obligatorios
            if(item !== 'cargo' && item !== 'cedula' && item !== 'email'){

                if(data[item] == ""){
                    errorSpecificQuery('Algún campo obligatorio esta vacío')
                    return;
                }
            }
           
        }
        try{
            const respuesta= await fetch("http://erv-zona3/backend/explo", {
                method: "POST",
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data_enviar)
            })

            if(respuesta.ok){
                exitSpecificQuery('Explorador creado exitosamente')
                navigate(`/dashboard/dest/explo?destacamento=${destacamento}`)
            }else{
              const result = await respuesta.json();
                const mensaje= result.error || "Error al procesar la solicitud.";
                errorSpecificQuery(mensaje)
            }
        }catch(error){
            console.log(error)
            errorGeneralQuery();
        }
       
    }
    const handleOnchange= (e) =>{
        const{name, value}= e.target
        setData({
            ...data,
            [name] : value
        })
    }
    return (
        <>
        <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombres">Nombres:</label>
        <input
          type="text"
          id="nombres"
          name="nombres"
          value={data.nombres}
          onChange={handleOnchange}
          required
        />
      </div>
      <div>
        <label htmlFor="apellidos">Apellidos:</label>
        <input
          type="text"
          id="apellidos"
          name="apellidos"
          value={data.apellidos}
          onChange={handleOnchange}
          required
        />
      </div>
      <div>
        <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
        <input
          type="date"
          id="fecha_nacimiento"
          name="fecha_nacimiento"
          value={data.fecha_nacimiento}
          onChange={handleOnchange}
          required
        />
      </div>
      <div>
        <label htmlFor="ascenso_id">Ascenso:</label>
        <select name="ascenso_id" id="ascenso_id" value={data.ascenso_id}  onChange={handleOnchange} required>
            <option value="">Seleccione un ascenso</option>
            {ascensos && (
                ascensos.map(ascenso =>(
                    <option key={ascenso.id} value={ascenso.id}>{ascenso.nombre}</option>
                ))
            )}
        </select>
      </div>
      <div>
        <label htmlFor="fecha_promesacion">Fecha de Promesación:</label>
        <input
          type="date"
          id="fecha_promesacion"
          name="fecha_promesacion"
          value={data.fecha_promesacion}
          onChange={handleOnchange}
          required
        />
      </div>
      <div>
        <label htmlFor="cargo">Cargo:</label>
        <input
          type="text"
          id="cargo"
          name="cargo"
          value={data.cargo}
          onChange={handleOnchange}
        />
      </div>
      <div>
        <label htmlFor="cedula">Cédula:</label>
        <input
          type="text"
          id="cedula"
          name="cedula"
          value={data.cedula}
          onChange={handleOnchange}
        />
      </div>
      <div>
        <label htmlFor="telefono">Teléfono:</label>
        <input
          type="text"
          id="telefono"
          name="telefono"
          value={data.telefono}
          onChange={handleOnchange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleOnchange}
        />
      </div>
      <button type="submit">Crear explorador</button>
    </form>
        </>
    )
}

export default CrearExplorador