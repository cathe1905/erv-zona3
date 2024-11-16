import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import GrowExample from "../../../funciones";

export async function getAscensos() {
  try {
    const result = await fetch("http://erv-zona3/backend/ascensos");

    if (result.ok) {
      const respuesta = await result.json();
      return respuesta;
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud", error);
    console.log(error);
    return;
  }
}
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
    const url = "http://erv-zona3/backend/excel?categoria=ascensos";
    window.location.href = url;
  };
  const eliminarRegistro = async () => {
    const id = { id: idEliminar };
    try {
      const query = await fetch("http://erv-zona3/backend/ascensos/eliminar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      if (query.ok) {
        Swal.fire({
          title: "Exito",
          text: "Ascenso eliminado exitosamente",
          icon: "success",
          confirmButtonText: "Ok",
        });
        setShow(false);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getData() {
    try {
      const respuesta = await getAscensos();
      if(respuesta){
        setData(respuesta);
        setIsLoading(false)
        setError(null); 
      }else{
        setError("Error al cargar los datos.");
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Hubo un problema con la solicitud", error);
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h2>Ascensos</h2>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
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
            <td colSpan="11" className="text-center">
              {GrowExample()}
            </td>
          </tr>
          ): data && data.length > 0 ?(
            data.map((ascenso) => (
              <tr key={ascenso.id}>
                <td>{contador++}</td>
                <td>{ascenso.nombre}</td>
                <td>{ascenso.rama}</td>
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
                            `/dashboard/admin/ascensos/editar?id=${ascenso.id}`
                          )
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
            Si
          </Button>
        </Modal.Footer>
      </Modal>
      <button onClick={() => navigate("/dashboard/admin/ascensos/crear")}>
        Crear Ascenso
      </button>
      <button onClick={dowload}>Descargar</button>
    </>
  );
};

export default Ascensos;
