import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GrowExample from "../../../components/GrowExample";
import { capitalize, api } from "../../../funciones";
import { errorGeneralQuery, errorSpecificQuery, exitSpecificQuery, getAscensos} from "../../../funciones";


const Ascensos = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  let contador = 1;
  const [idEliminar, setIdEliminar] = useState(null);
  const [nombreEliminar, setNombreEliminar] = useState(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const dowload = () => {
    const url = `${api}backend/excel?categoria=ascensos`;
    window.location.href = url;
  };
  const eliminarRegistro = async () => {
    const id = { id: idEliminar };
    try {
      const query = await fetch(`${api}backend/ascensos/eliminar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      if (query.ok) {
        exitSpecificQuery("Ascenso eliminado exitosamente")
        setShow(false);
        getData();
      }else{
        const respuesta = await query.json();
        const mensaje= respuesta.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje)
      }
    } catch (error) {
      console.log(error);
      errorGeneralQuery();
    }
  };

  async function getData() {
      const respuesta = await getAscensos();
      if(respuesta){
        setData(respuesta);
        setIsLoading(false)
        setError(null); 
      }else{
        setError("Error al cargar los datos.");
        setIsLoading(false)
      }
    } 
  

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {error && <p className="error-message text-center">{error}</p>}
      <div className="table-responsive d-flex justify-content-center">
        <div className="col-md-8">
          <table className="table table-bordered table-hover letra_muy_pequeña">
            <thead className="table-light">
              <tr>
                <th>n°</th>
                <th>Nombre</th>
                <th>Rama</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    {GrowExample()}
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((ascenso) => (
                  <tr key={ascenso.id}>
                    <td>{contador++}</td>
                    <td>{capitalize(ascenso.nombre)}</td>
                    <td>{capitalize(ascenso.rama)}</td>
                    <td>
                      <Dropdown drop="start">
                        <Dropdown.Toggle
                          as="span"
                          id="dropdown-custom-trigger"
                          className="action"
                        >
                          . . .
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() =>
                              navigate(`/dashboard/admin/ascensos/editar?id=${ascenso.id}`)
                            }
                            eventKey="1"
                          >
                            Editar
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleShow({ id: ascenso.id, nombre: ascenso.nombre })
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
                  <td colSpan="4" className="text-center">
                    No se encontraron registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Ascenso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro(a) que deseas eliminar el ascenso {nombreEliminar}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={eliminarRegistro} variant="primary">
            Sí
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex justify-content-end gap-2 m-3">
        <button
          onClick={() => navigate("/dashboard/admin/ascensos/crear")}
          className="btn btn-outline-primary letra_muy_pequeña"
        >
          Crear Ascenso
        </button>
        <button onClick={dowload} className="btn btn-outline-secondary letra_muy_pequeña">
          Descargar
        </button>
      </div>
    </>
  );
  
  
};

export default Ascensos;
