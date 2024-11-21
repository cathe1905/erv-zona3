import { useEffect } from "react";
import { useState } from "react";
import { capitalize, errorGeneralQuery, errorSpecificQuery, exitSpecificQuery} from "../../../funciones";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GrowExample from "../../../funciones";

export async function getDestacamentos() {
  try {
    const result = await fetch("http://erv-zona3/backend/destacamentos");

    if (result.ok) {
      const respuesta = await result.json();
      return respuesta;
    }else{
      const respuesta = await result.json();
      const mensaje= respuesta.error || "Error al procesar la solicitud.";
      errorSpecificQuery(mensaje)
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud", error);
    console.log(error);
    errorGeneralQuery();
  }
}
const Destacamentos = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const [nombreEliminar, setNombreEliminar] = useState(null);
  let contador = 1;
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

  const eliminarRegistro = async () => {
    try {
      const id = { id: idEliminar };
      const result = await fetch(
        "http://erv-zona3/backend/destacamentos/eliminar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
        }
      );

      if (result.ok) {
        exitSpecificQuery("Destacamento eliminado exitosamente")
        setShow(false);
        const respuesta = await getDestacamentos();
        setData(respuesta);
      }else{
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
    const fetchData = async () => {
        const result = await getDestacamentos();
        if(result){
          setData(result);
          setIsLoading(false)
          setError(null); 
        }else{
          setError("Error al cargar los datos.");
          setIsLoading(false)
        }
    };
    fetchData();
  }, []);

  const dowload = () => {
    const url = "http://erv-zona3/backend/excel?categoria=destacamentos";
    window.location.href = url;
  };

  return (
    <>
      <h2>Destacamentos</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="table-bordered">
        <thead>
          <tr>
            <th>n°</th>
            <th className="p-2">Nombre</th>
            <th>Comandante General</th>
            <th>Comandante Femenino</th>
            <th>Comandante Masculino</th>
            <th>Pastor</th>
            <th>Inst. Pionero</th>
            <th>Inst. Brijer</th>
            <th>Inst. Bes</th>
            <th>Secretaria</th>
            <th>Tesorero</th>
            <th>Capellán</th>
            <th>Zona</th>
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
          ): Array.isArray(data) && data.length > 0 ? (
            data.map((dest) => (
              <tr key={dest.id}>
                <td>{contador++}</td>
                <td>{capitalize(dest.nombre)}</td>
                <td>{capitalize(dest.comandante_general)}</td>
                <td>{capitalize(dest.comandante_femenino)}</td>
                <td>{capitalize(dest.comandante_masculino)}</td>
                <td>{capitalize(dest.pastor)}</td>
                <td>{capitalize(dest.inst_pionero)}</td>
                <td>{capitalize(dest.inst_brijer)}</td>
                <td>{capitalize(dest.inst_bes)}</td>
                <td>{capitalize(dest.secretaria)}</td>
                <td>{capitalize(dest.tesorero)}</td>
                <td>{capitalize(dest.capellan)}</td>
                <td>{dest.zona_id}</td>
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
                            `/dashboard/admin/destacamentos/editar?id=${dest.id}`
                          )
                        }
                        eventKey="1"
                      >
                        Editar
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handleShow({ id: dest.id, nombre: dest.nombre })
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
          <Modal.Title>Eliminar Destacamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro(a) que deseas eliminar el destacamento {nombreEliminar}?
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
      <div className="border">
        <a
          href="/dashboard/admin/destacamentos/crear"
          className="text-decoration-none"
          style={{ cursor: "pointer" }}
        >
          Crear Destacamento
        </a>
      </div>
      <button onClick={dowload}>Descargar</button>
    </>
  );
};

export default Destacamentos;
