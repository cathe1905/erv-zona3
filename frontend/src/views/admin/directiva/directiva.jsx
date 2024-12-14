import { useEffect } from "react";
import { useState } from "react";
import { capitalize } from "../../../funciones";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { errorGeneralQuery, errorSpecificQuery, exitSpecificQuery} from "../../../funciones";
import GrowExample from "../../../funciones";

const Directiva = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const [nombreEliminar, setNombreEliminar]= useState(null);
  let contador = 1;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => {
    setIdEliminar(null)
    setNombreEliminar(null)
    setShow(false)
  };
  const handleShow = ({id, nombre}) => {
    setIdEliminar(id)
    setNombreEliminar(nombre)
    setShow(true)
  };

  const eliminarRegistro= async () =>{
    try {
      const id= {id: idEliminar}
      const result = await fetch("http://erv-zona3/backend/directiva/eliminar",{
        method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(id)
      });
      console.log(result);
      if (result.ok) {
        exitSpecificQuery("Directivo eliminado exitosamente")
        setShow(false)
        getDirectiva();
      }else{
        const respuesta = await result.json();
        const mensaje= respuesta.error || "Error al procesar la solicitud.";
        errorSpecificQuery(mensaje)
      }
    } catch (error) {
      errorGeneralQuery();
      setShow(false)
      console.log(error);
    }
  }
  const getDirectiva = async () => {
    try {
      const result = await fetch("http://erv-zona3/backend/directiva");

      if (result.ok) {
        const respuesta = await result.json();
        setData(respuesta);
        setIsLoading(false)
        setError(null); 
      }else{
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
  useEffect(() => {
    
    getDirectiva();
  }, []);

  const dowload= () =>{
    const url = 'http://erv-zona3/backend/excel?categoria=directiva';
    window.location.href = url; 
}
  return (
    <>
    {error && <p className="error-message">{error}</p>}
    <div className="table-responsive">
      <table className="table table-bordered table-hover letra_muy_pequeña">
        <thead className="table-light">
          <tr>
            <th>n°</th>
            <th className="p-2">Nombres</th>
            <th>Apellidos</th>
            <th>Ascenso</th>
            <th>Cargo</th>
            <th>Teléfono</th>
            <th>Foto</th>
            <th>Destacamento</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="9" className="text-center">
                {GrowExample()}
              </td>
            </tr>
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((miembro) => (
              <tr key={miembro.id}>
                <td>{contador++}</td>
                <td>{capitalize(miembro.nombres)}</td>
                <td>{capitalize(miembro.apellidos)}</td>
                <td>{capitalize(miembro.ascenso)}</td>
                <td>{capitalize(miembro.cargo)}</td>
                <td>{capitalize(miembro.telefono)}</td>
                <td>
                  <img
                    className="img-fluid"
                    style={{ width: '100px' }}
                    src={`http://erv-zona3/imagenes/${miembro.foto}`}
                    alt="foto del directivo"
                  />
                </td>
                <td>{capitalize(miembro.destacamento)}</td>
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
                          navigate(`/dashboard/admin/directiva/editar?id=${miembro.id}`)
                        }
                        eventKey="1"
                      >
                        Editar
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handleShow({
                            id: miembro.id,
                            nombre: capitalize(miembro.nombres),
                          })
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
              <td colSpan="9" className="text-center">
                No se encontraron registros
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Directivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro(a) que deseas eliminar a {nombreEliminar}?
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
  
    <div className="d-flex justify-content-end gap-2">
      <a
        href="/dashboard/admin/directiva/crear"
        className="btn btn-outline-primary letra_muy_pequeña"
      >
        Crear miembro
      </a>
      <button
        onClick={dowload}
        className="btn btn-outline-secondary letra_muy_pequeña"
      >
        Descargar
      </button>
    </div>
  </>
  
  );
};

export default Directiva;
