import { useState } from "react"
import { capitalize, errorGeneralQuery, errorSpecificQuery, exitSpecificQuery} from "../../../funciones";
import { useNavigate } from "react-router-dom"

const CrearDestacamento =() =>{
    const navigate= useNavigate();
    const [data, setData] = useState( {
        nombre: "",
        comandante_general: "",
        comandante_femenino: "",
        comandante_masculino: "",
        pastor: "",
        inst_pionero: "",
        inst_brijer: "",
        inst_bes: "",
        secretaria: "",
        tesorero: "",
        capellan: "",
        zona_id: "3"
    });

    const handleSubmit= async (e) =>{
        const datosParaEnviar = {
            destacamento: { ...data }
          };
        e.preventDefault();

        for(let item in data){
            if(data[item] === ""){
                errorSpecificQuery('Todos los campos son obligatorios')
                return;
            }
        }
        try {
            const respuesta= await fetch('http://erv-zona3/backend/destacamentos', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(datosParaEnviar)
            });
            if(respuesta.ok){
                exitSpecificQuery('Destacamento guardado exitosamente')
                navigate('/dashboard/admin/destacamentos')
            }else{
                const result = await respuesta.json();
                const mensaje= result.error || "Error al procesar la solicitud.";
                errorSpecificQuery(mensaje)
            }
        } catch (error) {
            console.log(error)
            errorGeneralQuery();
        }
        
    }
    const handleChange= (e) =>{
        const{name, value} = e.target;
        setData({
            ...data,
            [name]: value
        })
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="nombre">Destacamento
                <input id="nombre" type="text" name="nombre" value={data.nombre} onChange={handleChange} placeholder="Nombre del destacamento" required/>
            </label>

            <label htmlFor="comandante_general">Comandante General
                <input id="comandante_general" type="text" name="comandante_general" value={data.comandante_general} onChange={handleChange} placeholder="Nombre y apellido" required/>
            </label>

            <label htmlFor="comandante_femenino">Comandante Femenino
                <input id="comandante_femenino" type="text" name="comandante_femenino" value={data.comandante_femenino} onChange={handleChange} placeholder="Nombre y apellido" required/>
            </label>

            <label htmlFor="comandante_masculino">Comandante Masculino
                <input id="comandante_masculino" type="text" name="comandante_masculino" value={data.comandante_masculino} onChange={handleChange} placeholder="Nombre y apellido" required/>
            </label>

            <label htmlFor="pastor">Pastor
                <input id="pastor" type="text" name="pastor" value={data.pastor} onChange={handleChange} placeholder="Nombre y apellido" required/>
            </label>

            <label htmlFor="inst_pionero">Instructor Pionero
                <input id="inst_pionero" type="text" name="inst_pionero" value={data.inst_pionero} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label htmlFor="inst_brijer">Instructor Brijer
                <input id="inst_brijer" type="text" name="inst_brijer" value={data.inst_brijer} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label htmlFor="inst_bes">Instructor BES
                <input id="inst_bes" type="text" name="inst_bes" value={data.inst_bes} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label htmlFor="secretaria">Secretaria
                <input id="secretaria" type="text" name="secretaria" value={data.secretaria} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label htmlFor="tesorero">Tesorero
                <input id="tesorero" type="text" name="tesorero" value={data.tesorero} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label htmlFor="capellan">Capellán
                <input id="capellan" type="text" name="capellan" value={data.capellan} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <button type="submit">Guardar Destacamento</button>
        </form>
        </>
    )
}

export default CrearDestacamento