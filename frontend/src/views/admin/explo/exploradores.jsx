import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginationGeneral from "../../../components/Pagination";
import { capitalize,  api } from "../../../funciones";
import GrowExample from "../../../components/GrowExample";
import { Table } from 'react-bootstrap';

const Explo = () => {
  const [params, setParams] = useSearchParams();
  const destacamento = params.get("destacamento") || "";
  const rama = params.get("rama") || "";
  const query = params.get("query") || "";
  const ascenso = params.get("ascenso") || "";
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "10", 10);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [destacamentos, setDestacamentos] = useState(null);
  const [ascensos, setAscensos]= useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  useEffect(() => {
    const getExploradores = async () => {
      try {
        const result = await fetch(
          `${api}backend/explo?destacamento=${destacamento}&rama=${rama}&query=${query}&ascenso=${ascenso}&page=${page}&limit=${limit}`
        );

        if (result.ok) {
          const respuesta = await result.json();
          setIsLoading(false)
          setData(respuesta.exploradores);
          setTotal(respuesta.total);
        }else{
          setIsLoading(false)
          setError("Error al cargar los datos.");
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
        const result = await fetch(`${api}backend/destacamentos`);
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
        const result = await fetch(`${api}backend/ascensos`);
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

  const handleAllFilters= () =>{
    setParams({
      ...Object.fromEntries(params),
      destacamento: "",
      rama: "",
      query: "",
      ascenso: "",
      limit:10,
      page: 1,
    });
  }
  // const url = `${api}backend/excel?categoria=exploradores&destacamento=${destacamento}&rama=${rama}&query=${query}&ascenso=${ascenso}&page=${page}&limit=${limit}&all=false`;
  // console.log(url)
  const dowload= (all) =>{
    
      const url = `${api}backend/excel?categoria=exploradores&destacamento=${destacamento}&rama=${rama}&query=${query}&ascenso=${ascenso}&page=${page}&limit=${limit}&all=${all}`;
      window.open(url, "_blank"); 
  }

  return (
    <div className="container-fluid letra_muy_pequeña">
      <div className="bg-light rounded p-3 mb-3">
        <div className="row g-3">
          <div className="col-md-4 col-lg-3">
            <select
              className="form-select letra_muy_pequeña"
              value={destacamento}
              onChange={(e) => handleFilterChange('destacamento', e.target.value)}
            >
              <option value="">Todos los Destacamentos</option>
              {destacamentos &&
                destacamentos.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {capitalize(dest.nombre)}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-4 col-lg-2">
            <select
              className="form-select letra_muy_pequeña"
              value={rama}
              onChange={(e) => handleFilterChange('rama', e.target.value)}
            >
              <option value="">Todas las ramas</option>
              <option value="pre-junior">Pre-junior y Pre-Joyas</option>
              <option value="pionero">Pioneros</option>
              <option value="brijer">Brijers</option>
              <option value="oficial">Oficiales</option>
            </select>
          </div>

          <div className="col-md-4 col-lg-1">
            <select
              className="form-select letra_muy_pequeña"
              value={limit}
              onChange={(e) => handleFilterChange('limit', e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="75">75</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="col-md-4 col-lg-2">
            <input
              type="text"
              className="form-control letra_muy_pequeña"
              placeholder="Buscar por un nombre"
              onChange={(e) =>
                handleFilterChange('query', e.target.value.trim() === '' ? '' : e.target.value)
              }
              value={query}
            />
          </div>

          <div className="col-md-4 col-lg-2">
            <select
              className="form-select letra_muy_pequeña"
              value={ascenso}
              onChange={(e) => handleFilterChange('ascenso', e.target.value)}
            >
              <option value="">Todos los ascensos</option>
              {ascensos &&
                ascensos.map((asc) => (
                  <option key={asc.id} value={asc.id}>
                    {capitalize(asc.nombre)}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-4 col-lg-2">
            <button className="btn btn-outline-secondary w-100 letra_muy_pequeña" onClick={handleAllFilters}>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive overflow-y-scroll" style={{ maxHeight: "400px"}}>
        <Table bordered hover>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Nombres</th>
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
            {isLoading ? (
              <tr>
                <td colSpan="12" className="text-center">
                  {GrowExample()}
                </td>
              </tr>
            ) : Array.isArray(data) && data.length > 0 ? (
              data.map((explo, index) => (
                <tr key={explo.id}>
                  <td>{(page - 1) * limit + index + 1}</td>
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
                <td colSpan="12" className="text-center">
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {total > 0 && (
        <div className="d-flex justify-content-end">
          <PaginationGeneral
            total={total}
            current_page={page}
            limit={limit}
            onSelectPage={handlePage}
          />
        </div>
      )}

      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-outline-primary letra_muy_pequeña" onClick={() => dowload('false')}>
          Descargar registros en pantalla
        </button>
        <button className="btn btn-primary letra_muy_pequeña" onClick={() => dowload('true')}>
          Descargar toda la selección: {total}
        </button>
      </div>
    </div>
  );
}


export default Explo;
