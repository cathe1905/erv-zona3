import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginationGeneral from "../../../components/Pagination";
import { capitalize } from "../../../../funciones";

const Explo = () => {
  const [params, setParams] = useSearchParams();
  const destacamento = params.get("destacamento") || null;
  const rama = params.get("rama") || null;
  const query = params.get("query") || null;
  const ascenso = params.get("ascenso") || null;
  const page = parseInt(params.get("page") || '1', 10);
  const limit = parseInt(params.get("limit") || '10', 10);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [destacamentos, setDestacamentos] = useState(null);

  useEffect(() => {
    const getExploradores = async () => {
      try {
        const result = await fetch(
          `http://erv-zona3/backend/explo?destacamento=${destacamento}&rama=${rama}&query=${query}&ascenso=${ascenso}&page=${page}&limit=${limit}`
        );

        if (result.ok) {
          const respuesta = await result.json();
          setData(respuesta.exploradores);
          setTotal(respuesta.total);
        }
      } catch (error) {
        console.error("Hubo un problema con la solicitud", error);
        console.log(error);
        return;
      }
    };
    getExploradores();
  }, [destacamento, rama, query, ascenso, page, limit]);

  useEffect(() =>{
    const getDestacamentos = async () =>{
      try{
        const result= await fetch("http://erv-zona3/backend/destacamentos");
      if(result.ok){
        const respuesta= await result.json();
        setDestacamentos(respuesta)
      }
      }catch(error){
        console.error("Hubo un problema con la solicitud", error);
        console.log(error);
        return;
      }
      
    }
    getDestacamentos();
  }, [])

  const handleFilterChange = (key, value) => {
    setParams({
      ...Object.fromEntries(params), 
      [key]: value,
      page: 1 
    });
  };

  const handlePage= (newPage) =>{
    setParams({
      ...Object.fromEntries(params), 
      page: newPage                  
    });
  }
console.log(data)
  return (
    <>
    <div>
      <select className="my-2" onChange={(e) => handleFilterChange('destacamento',e.target.value)}> 
      <option value={'null'}>Todos los destacamentos</option>
      {destacamentos &&
        destacamentos.map( (dest) =>(
          <option key={dest.id} value={dest.id}>{capitalize(dest.nombre)}</option>
        ))
      }
      </select>
    </div>
      <table className="table-bordered">
        <thead>
          <tr>
            <th className="p-2">Nombres</th>
            <th>Apellidos</th>
            <th>Fecha de Nacimiento</th>
            <th>Edad</th>
            <th>Rama</th>
            <th>Ascenso</th>
            <th>Cargo</th>
            <th>Cédula</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Destacamento</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.length > 0 &&
            data.map((explo) => (
              <tr key={explo.id}>
                <td>{capitalize(explo.nombres)}</td>
                <td>{capitalize(explo.apellidos)}</td>
                <td>{explo.fecha_nacimiento}</td>
                <td>{explo.edad}</td>
                <td>{capitalize(explo.rama)}</td>
                <td>{explo.ascenso}</td>
                <td>{explo.cargo}</td>
                <td>{explo.cedula}</td>
                <td>{explo.telefono}</td>
                <td>{explo.email}</td>
                <td>{capitalize(explo.destacamento)}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {total > 0 && (
        <PaginationGeneral
          total={total}
          current_page={page}
          limit={limit}
          onSelectPage={handlePage}
        />
      )}
    </>
  );
};

export default Explo;
