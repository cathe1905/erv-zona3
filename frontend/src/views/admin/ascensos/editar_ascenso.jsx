import { useState } from "react"
import Swal from 'sweetalert2'
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
                    console.log(result)
                    setData({
                        ...data,
                        ...result
                    })
                }
            }catch(error){
                console.log(error)
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
                Swal.fire({
                    title: 'Error!',
                    text: 'Todos los campos son obligatorios',
                    icon: 'error',
                    confirmButtonText: 'Revisar'
                });
                return;
            }
        }
        console.log(data_enviar)
        try{
            const respuesta= await fetch("http://erv-zona3/backend/ascensos/actualizar", {
                method: "POST",
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data_enviar)
            })

            if(respuesta.ok){
                Swal.fire({
                    title: 'Exito',
                    text: 'Ascenso editado exitosamente',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
                navigate('/dashboard/admin/ascensos')
            }
        }catch(error){
            console.log(error)
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
            <label>Nombre
                <input type="text" required value={data.nombre} name="nombre" onChange={handleOnchange}/>
            </label>
            <label>Rama
            <select name="rama" required onChange={handleOnchange} value={data.rama}>
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