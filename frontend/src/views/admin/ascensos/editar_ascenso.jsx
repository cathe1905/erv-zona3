import { useState } from "react"
import { exitSpecificQuery, errorSpecificQuery, errorGeneralQuery} from "../../../funciones";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

const EditarAscenso =() =>{
    const [params, setParams] = useSearchParams();
    const id= parseInt(params.get('id'), 10) || null;
    const navigate= useNavigate();
    const [data, setData] = useState({
        nombre: "",
        rama: ""
    })

    useEffect(() =>{
        const getAscensoById= async () =>{
            try{
                const query= await fetch(`http://erv-zona3/backend/ascensos/actualizar?id=${id}`)
                if(query.ok){
                    const result= await query.json();
                    setData({
                        ...data,
                        ...result
                    })
                }else{
                    const result = await query.json();
                    const mensaje= result.error || "Error al procesar la solicitud.";
                    errorSpecificQuery(mensaje)
                }
            }catch(error){
                console.log(error)
                errorGeneralQuery();
            }
            
        }
        getAscensoById();
    },[])
 
    const handleSubmit= async (e) =>{
        e.preventDefault();
        const data_enviar= {
            ascenso: {...data}
        }
        
        for(let item in data){
            if(data[item] === ""){
                errorSpecificQuery('Todos los campos son obligatorios')
                return;
            }
        }

        try{
            const respuesta= await fetch("http://erv-zona3/backend/ascensos/actualizar", {
                method: "POST",
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data_enviar)
            })

            if(respuesta.ok){
                exitSpecificQuery('Ascenso actualizado exitosamente')
                navigate('/dashboard/admin/ascensos')
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
            <label htmlFor="nombre">Nombre
                <input id="nombre" type="text" required value={data.nombre} name="nombre" onChange={handleOnchange}/>
            </label>
            <label htmlFor="rama">Rama
            <select id="rama" name="rama" required onChange={handleOnchange} value={data.rama}>
                <option value="">Selecciona una rama</option>
                <option value="pre-junior">Pre-junior y Pre-joya</option>
                <option value="pionero">Junior y Joya</option>
                <option value="brijer">Brijer</option>
                <option value="oficial">Oficial</option>
            </select>
            </label>
            
            <button type="submit">Editar Ascenso</button>
        </form>
        </>
       
    )
}

export default EditarAscenso