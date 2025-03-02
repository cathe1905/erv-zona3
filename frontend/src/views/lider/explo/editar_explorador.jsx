import { useEffect, useState } from "react";
import { errorGeneralQuery, errorSpecificQuery, exitSpecificQuery, api, capitalize, getAscensos } from "../../../funciones";
import { useNavigate } from "react-router-dom"
import { getUserSession } from "../../../funciones";
import { useSearchParams } from "react-router-dom"
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const EditarExplorador =() =>{
    const navigate= useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [params, setParams] = useSearchParams();
    const id= parseInt(params.get('id'), 10) || null;
    // eslint-disable-next-line no-unused-vars
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
                const query= await fetch(`${api}backend/explo/actualizar?id=${id}`)
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
        getExploById();
    },[data, id])

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
        const respuesta= await fetch(`${api}backend/explo/actualizar`, {
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data_enviar)
        })

        if(respuesta.ok){
            exitSpecificQuery('Explorador actualizado exitosamente')
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
        <form 
          onSubmit={handleSubmit} 
          className="container mt-0 mt-md-4 p-4 rounded shadow-sm bg-light"
          style={{ maxWidth: '600px' }} 
        >
          <h2 className="text-center mb-4">Editar explorador</h2>
    
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
                  onChange={handleOnchange} 
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
                  onChange={handleOnchange} 
                  placeholder="Apellidos" 
                  required 
                />
              </FloatingLabel>
            </div>
    
            <div className="col-12">
              <FloatingLabel 
                controlId="floatingFechaNacimiento"
                label="Fecha de Nacimiento"
                className="mb-3"
              >
                <Form.Control 
                  type="date" 
                  name="fecha_nacimiento" 
                  value={data.fecha_nacimiento} 
                  onChange={handleOnchange} 
                  max={new Date().toISOString().split('T')[0]}
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
                  onChange={handleOnchange}
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
                controlId="floatingFechaPromesacion"
                label="Fecha de Promesación"
                className="mb-3"
              >
                <Form.Control 
                  type="date" 
                  name="fecha_promesacion" 
                  value={data.fecha_promesacion} 
                  onChange={handleOnchange} 
                  max={new Date().toISOString().split('T')[0]}
                  required 
                />
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
                  onChange={handleOnchange} 
                  placeholder="Cargo" 
                />
              </FloatingLabel>
            </div>
    
            <div className="col-12">
              <FloatingLabel 
                controlId="floatingCedula"
                label="Cédula"
                className="mb-3"
              >
                <Form.Control 
                  type="text" 
                  name="cedula" 
                  value={data.cedula} 
                  onChange={handleOnchange} 
                  placeholder="Cédula" 
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
                  type="number" 
                  name="telefono" 
                  value={data.telefono} 
                  onChange={handleOnchange} 
                  placeholder="Teléfono" 
                  required 
                />
              </FloatingLabel>
            </div>
    
            <div className="col-12">
              <FloatingLabel 
                controlId="floatingEmail"
                label="Email"
                className="mb-3"
              >
                <Form.Control 
                  type="email" 
                  name="email" 
                  value={data.email} 
                  onChange={handleOnchange} 
                  placeholder="Email" 
                />
              </FloatingLabel>
            </div>
    
            <div className="col-12">
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </form>
      </>
    );    

}

export default EditarExplorador