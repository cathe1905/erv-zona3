import { useEffect, useState } from "react"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"
import { getDestacamentos } from "../destacamentos/destacamentos"
import { capitalize } from "../../../funciones"
import { getUserSession } from "../../lider/LayoutDest";
import { find_names_by_ids } from "./editar_usuario"

const CrearUsuario =() =>{
    const navigate= useNavigate();
    const [destacamentos, setDestacamentos] = useState(null)
    const [data, setData] = useState({
        nombre:"",
        apellido: "",
        email: "",
        contraseña: "",
        rol: "",
        destacamento_id: ""
    });
    const [log, setLog] = useState({
        admin_id: "",
        action: "",
        target_id: "",
        details: "",
      });
    const [idUserSession, setIdUserSession] = useState(null);
    const [id, setId] = useState(null);

    useEffect(()=>{
        const fetchDestacamentos = async () => {
            const result = await getDestacamentos();
            setDestacamentos(result);
          };
          fetchDestacamentos();

          const dataUserSession = getUserSession();
          setIdUserSession(dataUserSession.id);
    },[])

    useEffect(() =>{
        const log_data_enviar= {
            log: {...log}
          }
        if (log.admin_id !== "" || log.action !== "" || log.target_id !== "" || log.details !== "") {
            const save_log= async () =>{
                try{
                  const query= await fetch('http://erv-zona3/backend/logs',{
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(log_data_enviar),
                  })
                  if (query.ok) {
                    Swal.fire({
                      title: "Exito",
                      text: "Usuario creado exitosamente",
                      icon: "success",
                      confirmButtonText: "Ok",
                    });
                    navigate("/dashboard/admin/usuarios");
                  }
                } catch (error) {
                  console.log(error);
                }
              }
              save_log();
        }
    }, [log])

    useEffect(() => {
        if (id !== null) {
            evaluacion();
        }
    }, [id]);

    const get_id = async () => {
        try {
            const query = await fetch(`http://erv-zona3/backend/user/email?email=${data.email}`);
            if (query.ok) {
                const result = await query.json();
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    };
    const evaluacion= () =>{
        let detalles= "Se añadió la siguiente información: "

        Object.entries(data).forEach(([key, value]) => {
            if(key != "contraseña"){
                if (key == "destacamento_id" || key == "rol") {
                    const result = find_names_by_ids(key, value, destacamentos);
                    detalles += `${key}: ${result} `;
                  } else {
                    detalles += `${key}: ${value} `;
                  }
            }
          });

          setLog({
            ...log,
            admin_id: idUserSession,
            action: "Creación de un nuevo usuario",
            target_id: id,
            details: detalles,
          });
    }

    const handleSubmit= async (e) =>{
        e.preventDefault();
        const data_enviar= {
            usuario: {...data}
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

            const respuesta= await fetch("http://erv-zona3/backend/users", {
                method: "POST",
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data_enviar)
            })

            if(respuesta.ok){
                const fetchId = async () => {
                    const result = await get_id();
                    setId(result.id);
                };
                fetchId();
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
                <input type="text" autoComplete="username" required value={data.nombre} name="nombre" placeholder="Escribe el nombre" onChange={handleOnchange}/>
            </label>
            <label>Apellido
                <input type="text" autoComplete="username" required value={data.apellido} name="apellido" placeholder="Escribe el apellido" onChange={handleOnchange}/>
            </label>
            <label>Email
                <input type="email" autoComplete="username" required value={data.email} name="email" placeholder="Escribe el email" onChange={handleOnchange}/>
            </label>
            <label>Destacamento
            <select name="destacamento_id" required onChange={handleOnchange}>
                <option value="">Selecciona un destacamento</option>
                {destacamentos &&(
                    destacamentos.map(dest =>(
                        <option key={dest.id} value={dest.id}>{capitalize(dest.nombre)}</option>
               
                    ))
                )}
            </select>
            </label>
            <label>Contraseña
                <input type="password" autoComplete="current-password" name="contraseña" placeholder="Tu contraseña" onChange={handleOnchange} required/>
            </label>
            <label>Rol
            <select name="rol" required onChange={handleOnchange}>
                <option value="">Selecciona un rol</option>
                <option value="1">Administrador</option>
                <option value="2">Usuario</option>
            </select>
            </label>
           
            <button type="submit">Guardar usuario</button>
        </form>
        </>
       
    )
}

export default CrearUsuario