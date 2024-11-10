import { useState } from "react"
import { useEffect } from "react"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"
import { useSearchParams } from "react-router-dom"

const EditarDestacamento = () =>{
    const navigate= useNavigate();
    const [params, setParams] = useSearchParams();
    const id= parseInt(params.get('id'), 10) || null;
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

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const respuesta = await fetch(`http://erv-zona3/backend/destacamentos/actualizar?id=${id}`);
    
                if (respuesta.ok) {
                    const result = await respuesta.json();
    
                    // Actualizar el estado 'data' con los valores de 'result'
                    setData(prevData => ({
                        ...prevData,
                        ...result // Sobreescribir solo las propiedades necesarias
                    }));
                }
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
    
        // Llamar a la función
        fetchData();
    }, [id])

    const handleSubmit= async (e) =>{
        const datosParaEnviar = {
            destacamento: { ...data }
          };
        e.preventDefault();

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

        const respuesta= await fetch('http://erv-zona3/backend/destacamentos/actualizar', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(datosParaEnviar)
        });
        if(respuesta.ok){
            Swal.fire({
                title: 'Exito',
                text: 'Destacamento editado exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
            navigate('/dashboard/admin/destacamentos')
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
        {data !== null &&(
            <form onSubmit={handleSubmit}>
            <label>Destacamento
                <input type="text" name="nombre" value={data.nombre} onChange={handleChange} placeholder="Nombre del destacamento" required/>
            </label>

            <label>Comandante General
                <input type="text" name="comandante_general" value={data.comandante_general} onChange={handleChange} placeholder="Nombre y apellido" required/>
            </label>

            <label>Comandante Femenino
                <input type="text" name="comandante_femenino" value={data.comandante_femenino} onChange={handleChange} placeholder="Nombre y apellido" required/>
            </label>

            <label>Comandante Masculino
                <input type="text" name="comandante_masculino" value={data.comandante_masculino} onChange={handleChange} placeholder="Nombre y apellido" required/>
            </label>

            <label>Pastor
                <input type="text" name="pastor" value={data.pastor} onChange={handleChange} placeholder="Nombre y apellido" required/>
            </label>

            <label>Instructor Pionero
                <input type="text" name="inst_pionero" value={data.inst_pionero} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label>Instructor Brijer
                <input type="text" name="inst_brijer" value={data.inst_brijer} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label>Instructor BES
                <input type="text" name="inst_bes" value={data.inst_bes} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label>Secretaria
                <input type="text" name="secretaria" value={data.secretaria} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label>Tesorero
                <input type="text" name="tesorero" value={data.tesorero} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <label>Capellán
                <input type="text" name="capellan" value={data.capellan} onChange={handleChange} placeholder="Nombre y apellido" required/>  
            </label>

            <button type="submit">Editar Destacamento</button>
        </form>
        )

        }
        
        </>
    )
}

export default EditarDestacamento