import { useEffect } from "react";
import { useState } from "react";
import { capitalize } from "../../funciones";
import PaginationGeneral from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import GrowExample from "../../funciones";


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
        const result = await fetch(`http://erv-zona3/backend/logs?page=${page}&limit=${limit}`);

        if (result.ok) {
          const respuesta = await result.json();
          setIsLoading(false)
          setData(respuesta.logs);
          setTotal(respuesta.total);
          setError(null); 
        } else {
          setError("Error al cargar los datos.");
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Hubo un problema con la solicitud", error);
        console.log(error);
        return;
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
      <h2>Registro de Actividades de Administradores</h2>
      {error && <p className="error-message">{error}</p>}
      <label>Límite de resultados
      <select onChange={(e) => handleFilterChange("limit", e.target.value)}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>
      </label>

      <table>
        <thead>
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
      <td colSpan="11" className="text-center">
        {GrowExample()}
      </td>
    </tr>
  ) : data && data.length > 0 ? (

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
      <td colSpan="11" className="text-center">
        No se encontraron registros
      </td>
    </tr>
  )}
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
export default Logs;
