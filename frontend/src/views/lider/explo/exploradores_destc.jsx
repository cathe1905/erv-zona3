import { useEffect, useState } from "react";
import { useNavigate, useSearchParams  } from "react-router-dom";
import PaginationGeneral from "../../../components/Pagination";
import { capitalize, errorGeneralQuery, errorSpecificQuery, exitSpecificQuery } from "../../../funciones";
import GrowExample from "../../../funciones";
import { getUserSession } from "../LayoutDest";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Explo_dest = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [destacamento, setDestacamento]= useState("");
    const [params, setParams] = useSearchParams();
    const rama = params.get("rama") || "";
    const query = params.get("query") || "";
    const ascenso = params.get("ascenso") || "";
    const page = parseInt(params.get("page") || "1", 10);
    const limit = parseInt(params.get("limit") || "10", 10);
    const [ascensos, setAscensos]= useState(null);
    const [data, setData] = useState(null);
    const [total, setTotal] = useState(null);
    const [idEliminar, setIdEliminar] = useState(null);
    const [nombreEliminar, setNombreEliminar] = useState(null);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => {
      setIdEliminar(null);
      setNombreEliminar(null);
      setShow(false);
    };
    const handleShow = ({ id, nombre }) => {
      setIdEliminar(id);
      setNombreEliminar(nombre);
      setShow(true);
    };

    useEffect(() =>{
            const userData= getUserSession();
            if(userData){
               setDestacamento(userData.destacamento_id);
            }
      }, [])

      const getExploradores = async () => {
        if (!destacamento) return; 
        try {
          const result = await fetch(
            `http://erv-zona3/backend/explo?destacamento=${destacamento}&rama=${rama}&query=${query}&ascenso=${ascenso}&page=${page}&limit=${limit}`
          );
          if (result.ok) {
            const respuesta = await result.json();
            setIsLoading(false)
            setData(respuesta.exploradores);
            setTotal(respuesta.total);
          }else{
            setIsLoading(false)
            setError("Error al cargar los datos.");
            const respuesta = await result.json();
            const mensaje= respuesta.error || "Error al procesar la solicitud.";
            errorSpecificQuery(mensaje)
          }
        } catch (error) {
          
          console.error("Hubo un problema con la solicitud", error);
          console.log(error);
          errorGeneralQuery();
          return;
        }
      };

    useEffect(() => {
        
        getExploradores();
      }, [rama, query, ascenso, page, limit, destacamento]);

      useEffect(() => {
        const getAscensos = async () => {
          try {
            const result = await fetch("http://erv-zona3/backend/ascensos");
            if (result.ok) {
              const respuesta = await result.json();
              setAscensos(respuesta);
            }else{
              const respuesta = await result.json();
              const mensaje= respuesta.error || "Error al procesar la solicitud.";
              errorSpecificQuery(mensaje)
            }
          } catch (error) {
            console.error("Hubo un problema con la solicitud", error);
            errorGeneralQuery();
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

      const eliminarRegistro = async () => {
        const id = { id: idEliminar };
        try {
          const query = await fetch("http://erv-zona3/backend/explo/eliminar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(id),
          });
          if (query.ok) {
            exitSpecificQuery("Explorador eliminado exitosamente")
            setShow(false);
            getExploradores();
          }else{
            const respuesta = await result.json();
            const mensaje= respuesta.error || "Error al procesar la solicitud.";
            errorSpecificQuery(mensaje)
          }
        } catch (error) {
          console.log(error);
          errorGeneralQuery();
        }
      };
    
      const dowload= (all) =>{
          const url = `http://erv-zona3/backend/excel?categoria=exploradores&destacamento=${destacamento}&rama=${rama}&query=${query}&ascenso=${ascenso}&page=${page}&limit=${limit}&all=${all}`;
          window.location.href = url; 
      }

    return (
       <>
        <h2>Exploradores</h2>
        {error && <p className="error-message">{error}</p>}
      <div>

        <select onChange={(e) => handleFilterChange("limit", e.target.value)} value={limit}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>

        <select
          name="rama"
          onChange={(e) => handleFilterChange("rama", e.target.value)}
          value={rama}
        >
          <option value="">Todas las ramas</option>
          <option value="pre-junior">Pre-junior y Pre-Joyas</option>
          <option value="pionero">Pioneros</option>
          <option value="brijer">Brijers</option>
          <option value="oficial">Oficiales</option>
        </select>

          <label>
            <input
              type="text"
              placeholder="Buscar por un nombre"
              onChange={(e) =>
                handleFilterChange(
                  "query",
                  e.target.value.trim() === "" ? "" : e.target.value
                )
              }
              value={query}
            />
          </label>

        <select onChange={(e) => handleFilterChange("ascenso", e.target.value)} value={ascenso}>
        <option value="">Todos los ascensos</option>
          {ascensos && 
            ascensos.map(asc =>(
              <option key={asc.id} value={asc.id}>{capitalize(asc.nombre)}</option>
            ))
          }
        </select>
        <button onClick={handleAllFilters}>Limpiar filtros</button>
      </div>
      <table className="table-bordered">
        <thead>
          <tr>
            <th>n°</th>
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
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
        {isLoading ? (
              <tr>
              <td colSpan="11" className="text-center">
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
                <td>
                  <Dropdown drop="start">
                    <Dropdown.Toggle
                      as="span"
                      id="dropdown-custom-trigger"
                      className="border p-1 action"
                    >
                      . . .
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          navigate(
                            `/dashboard/dest/explo/editar?id=${explo.id}`
                          )
                        }
                        eventKey="1"
                      >
                        Editar
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handleShow({ id: explo.id, nombre: capitalize(explo.nombres) + ' ' + capitalize(explo.apellidos)})
                        }
                        eventKey="2"
                      >
                        Eliminar
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
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

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar explorador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro(a) que deseas eliminar a: {nombreEliminar}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={eliminarRegistro} variant="primary">
            Si
          </Button>
        </Modal.Footer>
      </Modal>

      {total > 0 && (
        <PaginationGeneral
          total={total}
          current_page={page}
          limit={limit}
          onSelectPage={handlePage}
        />
      )}

      <button onClick={() => dowload('false')}>Descargar registros en pantalla</button>
      {total > 10 && (
        <button onClick={() => dowload('true')}>Descargar toda la selección: {total}</button>
      )}

      <button onClick={() => navigate("/dashboard/dest/explo/crear")}>
        Crear nuevo explorador
      </button>
      
    
       </>
    )
}

export default Explo_dest;