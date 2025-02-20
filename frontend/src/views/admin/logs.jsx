import { useEffect } from "react";
import { useState } from "react";
import { capitalize, api, errorGeneralQuery, errorSpecificQuery } from "../../funciones";
import PaginationGeneral from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import GrowExample from "../../components/GrowExample";


const Logs = () => {
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "10", 10);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLogs = async () => {
      try {
        const result = await fetch(`${api}backend/logs?page=${page}&limit=${limit}`);

        if (result.ok) {
          const respuesta = await result.json();
          setIsLoading(false)
          setData(respuesta.logs);
          setTotal(respuesta.total);
          setError(null); 
        } else {
          setError("Error al cargar los datos.");
          setIsLoading(false)
          const respuesta = await result.json();
          const mensaje= respuesta.error || "Error al procesar la solicitud.";
          errorSpecificQuery(mensaje)
        }
      } catch (error) {
        console.error("Hubo un problema con la solicitud", error);
        console.log(error);
        errorGeneralQuery();
      }
    };
    getLogs();
  }, [page, limit]);

  const handleFilterChange = (key, value) => {
    setParams({
      ...Object.fromEntries(params),
      [key]: value,
      page: 1,
    });
  };

  const handlePage = (newPage) => {
    setParams({
      ...Object.fromEntries(params),
      page: newPage,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatHora= (str) =>{
    const splited= str.split(" ");
    const time = new Date(`1970-01-01T${splited[1]}Z`);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  return (
    <>
    {error && <p className="error-message text-center text-danger">{error}</p>}
  
    <div className="mb-4 ms-2 ms-md-0">
      <label htmlFor="limit" className="me-2">Límite de resultados</label>
      <select 
        id="limit" 
        onChange={(e) => handleFilterChange("limit", e.target.value)} 
        className="form-select d-inline w-auto"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="75">75</option>
        <option value="100">100</option>
      </select>
    </div>
  
    <div className="table-responsive overflow-y-scroll" style={{ maxHeight: "400px"}}>
      <table className="table table-bordered table-hover letra_muy_pequeña">
        <thead className="table-light">
          <tr>
            <th>n°</th>
            <th>Acción</th>
            <th>¿Quién lo ejecutó?</th>
            <th>Usuario afectado</th>
            <th>Detalles</th>
            <th>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="text-center">
                {GrowExample()}
              </td>
            </tr>
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((log, index) => (
              <tr key={log.id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{log.action}</td>
                <td>{capitalize(log.admin_nombre)} {capitalize(log.admin_apellido)}</td>
                <td>{capitalize(log.target_nombre)} {capitalize(log.target_apellido)}</td>
                <td>{log.details}</td>
                <td>{formatDate(log.date)} - {formatHora(log.date)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No se encontraron registros
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  
    {total > 0 && (
      <div className="d-flex justify-content-end mx-2 my-3">
      <PaginationGeneral
        total={total}
        current_page={page}
        limit={limit}
        onSelectPage={handlePage}
      />
      </div>
    )}
  </>
  
  );
};
export default Logs;
