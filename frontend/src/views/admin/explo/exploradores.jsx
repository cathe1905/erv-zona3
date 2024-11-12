import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginationGeneral from "../../../components/Pagination";
import { capitalize } from "../../../funciones";


const Explo = () => {
  const [params, setParams] = useSearchParams();
  const destacamento = params.get("destacamento") || null;
  const rama = params.get("rama") || null;
  const query = params.get("query") || null;
  const ascenso = params.get("ascenso") || null;
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "10", 10);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [destacamentos, setDestacamentos] = useState(null);
  const [ascensos, setAscensos]= useState(null);
  const [all, setAll]= useState(false);

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

  useEffect(() => {
    const getDestacamentos = async () => {
      try {
        const result = await fetch("http://erv-zona3/backend/destacamentos");
        if (result.ok) {
          const respuesta = await result.json();
          setDestacamentos(respuesta);
        }
      } catch (error) {
        console.error("Hubo un problema con la solicitud", error);
        console.log(error);
        return;
      }
    };
    getDestacamentos();
  }, []);

  useEffect(() => {
    const getAscensos = async () => {
      try {
        const result = await fetch("http://erv-zona3/backend/ascensos");
        if (result.ok) {
          const respuesta = await result.json();
          setAscensos(respuesta);
        }
      } catch (error) {
        console.error("Hubo un problema con la solicitud", error);
        console.log(error);
        return;
      }
    };
    getAscensos();
  }, []);

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

  const dowload= (all) =>{
      const url = `http://erv-zona3/backend/excel?categoria=exploradores&destacamento=${destacamento}&rama=${rama}&query=${query}&ascenso=${ascenso}&page=${page}&limit=${limit}&all=${all}`;
      window.location.href = url; 
  }

  return (
    <>
    <h2>Exploradores</h2>
      <div>
        <select
          className="my-2"
          onChange={(e) => handleFilterChange("destacamento", e.target.value)}
        >
          <option value={"null"}>Todos los destacamentos</option>
          {destacamentos &&
            destacamentos.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {capitalize(dest.nombre)}
              </option>
            ))}
        </select>

        <select onChange={(e) => handleFilterChange("limit", e.target.value)}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>

        <select
          name="rama"
          onChange={(e) => handleFilterChange("rama", e.target.value)}
        >
          <option value="null">Todas las ramas</option>
          <option value="pre-junior">Pre-junior y Pre-Joyas</option>
          <option value="pionero">Pioneros</option>
          <option value="brijer">Brijers</option>
          <option value="oficial">Oficiales</option>
        </select>

        <form>
          <label>
            <input
              type="text"
              placeholder="Buscar por un nombre"
              onChange={(e) =>
                handleFilterChange(
                  "query",
                  e.target.value.trim() === "" ? null : e.target.value
                )
              }
            />
          </label>
        </form>

        <select onChange={(e) => handleFilterChange("ascenso", e.target.value)}>
        <option value={"null"}>Todos los ascensos</option>
          {ascensos && 
            ascensos.map(asc =>(
              <option key={asc.id} value={asc.id}>{capitalize(asc.nombre)}</option>
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
          {Array.isArray(data) && data.length > 0 ? (
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

      <button onClick={() => dowload('false')}>Descargar registros en pantalla</button>
      <button onClick={() => dowload('true')}>Descargar toda la selección: {total}</button>
    </>
  );
};

export default Explo;
