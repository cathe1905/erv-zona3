import { getAscensos } from "../../admin/ascensos/ascensos"
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"
import { getUserSession } from "../LayoutDest";
import { useSearchParams } from "react-router-dom"

const EditarExplorador =() =>{
    const navigate= useNavigate();
    const [params, setParams] = useSearchParams();
    const id= parseInt(params.get('id'), 10) || null;
    const [error, setError] = useState(null);
    const [ascensos, setAscensos] = useState(null);
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
            setDestacamento(userData.destacamento)
        }
      }, [])

      useEffect(() =>{
        const getExploById= async () =>{
            try{
                const query= await fetch(`http://erv-zona3/backend/explo/actualizar?id=${id}`)
                if(query.ok){
                    const result= await query.json();
                    setData({
                        ...data,
                        ...result
                    })
                }
            }catch(error){
                console.log(error)
            }
            
        }
        getExploById();
    },[])

    //   useEffect(() => {
    //     setData((prevData) => ({
    //         ...prevData,
    //         destacamento_id: idDestacamento,
    //     }));
    // }, [idDestacamento]);

      useEffect(() => {
        async function getdataAscensos() {
            try {
              const respuesta = await getAscensos();
              if(respuesta){
                setAscensos(respuesta);
              }else{
                setError("Error al cargar los ascensos");
              }
            } catch (error) {
              console.error("Hubo un problema con la solicitud", error);
              console.log(error);
              return;
            }
          }
          getdataAscensos();
      }, []);

    const handleSubmit= async (e) =>{
        e.preventDefault();
        const data_enviar= {
            explorador: {...data}
        }
        console.log(data)
        for(let item in data){
            //estos campos no son obligatorios
            if(item !== 'cargo' && item !== 'cedula' && item !== 'email'){

                if(data[item] == ""){
                    console.log(data[item])
                    Swal.fire({
                        title: 'Error!',
                        text: 'Algún campo obligatorio esta vacío',
                        icon: 'error',
                        confirmButtonText: 'Revisar'
                    });
                    return;
                }
            }
           
        }
        try{
            const respuesta= await fetch("http://erv-zona3/backend/explo/actualizar", {
                method: "POST",
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data_enviar)
            })

            if(respuesta.ok){
                Swal.fire({
                    title: 'Exito',
                    text: 'Explorador modificado exitosamente',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
                navigate(`/dashboard/dest/explo?destacamento=${destacamento}`)
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
      <button type="submit">Editar explorador</button>
    </form>
        </>
    )
}

export default EditarExplorador