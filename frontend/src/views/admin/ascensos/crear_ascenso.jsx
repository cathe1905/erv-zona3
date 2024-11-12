import { useState } from "react"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"

const CrearAscenso =() =>{
    const navigate= useNavigate();
    const [data, setData] = useState({
        nombre: "",
        rama: ""
    })

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
        try{
            const respuesta= await fetch("http://erv-zona3/backend/ascensos", {
                method: "POST",
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data_enviar)
            })

            if(respuesta.ok){
                Swal.fire({
                    title: 'Exito',
                    text: 'Ascenso guardado exitosamente',
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
            <select name="rama" required onChange={handleOnchange}>
                <option value="">Selecciona una rama</option>
                <option value="pre-junior">Pre-junior y Pre-joya</option>
                <option value="pionero">Junior y Joya</option>
                <option value="brijer">Brijer</option>
                <option value="oficial">Oficial</option>
            </select>
            </label>
            
            <button type="submit">Guardar Ascenso</button>
        </form>
        </>
       
    )
}

export default CrearAscenso