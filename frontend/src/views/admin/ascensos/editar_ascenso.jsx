import { useState } from "react"
import { exitSpecificQuery, errorSpecificQuery, errorGeneralQuery} from "../../../funciones";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

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
        <form 
          onSubmit={handleSubmit} 
          className="container mt-4 p-4 rounded shadow-sm bg-light"
          style={{ maxWidth: '600px' }} 
        >
          <h2 className="text-center mb-4">Editar Ascenso</h2>
          
          <div className="row gy-3">
            {/* Campo Nombre */}
            <div className="col-12">
              <FloatingLabel 
                controlId="floatingNombre"
                label="Nombre"
                className="mb-3"
              >
                <Form.Control 
                  type="text" 
                  name="nombre" 
                  value={data.nombre} 
                  onChange={handleOnchange} 
                  placeholder="Nombre"
                  required
                />
              </FloatingLabel>
            </div>
      
            {/* Campo Rama */}
            <div className="col-12">
              <FloatingLabel 
                controlId="floatingRama"
                label="Rama"
                className="mb-3"
              >
                <Form.Control 
                  as="select" 
                  name="rama" 
                  value={data.rama} 
                  onChange={handleOnchange} 
                  required
                >
                  <option value="">Selecciona una rama</option>
                  <option value="pre-junior">Pre-junior y Pre-joya</option>
                  <option value="pionero">Junior y Joya</option>
                  <option value="brijer">Brijer</option>
                  <option value="oficial">Oficial</option>
                </Form.Control>
              </FloatingLabel>
            </div>
      
            {/* Botón de Enviar */}
            <div className="col-12">
              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  Editar Ascenso
                </button>
              </div>
            </div>
          </div>
        </form>
      </>      
       
    )
}

export default EditarAscenso