import { useEffect } from "react";
import { useState } from "react";
import { capitalize } from "../../../funciones";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { getUserSession } from "../../lider/LayoutDest";
import GrowExample from "../../../funciones";

const Usuarios = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  let contador = 1;
  const [idEliminar, setIdEliminar] = useState(null);
  const [nombreEliminar, setNombreEliminar] = useState(null);
  const [apellidoEliminar, setApellidoEliminar] = useState(null);
  const [show, setShow] = useState(false);
  const [sent, setSent] = useState(false);
  const [idUserSession, setIdUserSession] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dowload = () => {
    const url = "http://erv-zona3/backend/excel?categoria=usuarios";
    window.location.href = url;
  };

  const handleClose = () => {
    setIdEliminar(null);
    setNombreEliminar(null);
    setApellidoEliminar(null);
    setShow(false);
  };
  const handleShow = ({ id, nombre, apellido }) => {
    setIdEliminar(id);
    setNombreEliminar(nombre);
    setApellidoEliminar(apellido);
    setShow(true);
  };
  const getUsers = async () => {
    try {
      const query = await fetch("http://erv-zona3/backend/users");
      if (query.ok) {
        const result = await query.json();
        setData(result);
        setIsLoading(false);
        setError(null);
      } else {
        setError("Error al cargar los datos.");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    const dataUserSession = getUserSession();
    setIdUserSession(dataUserSession.id);
  }, []);

  useEffect(() => {
    if (sent === true) {
      const log_data_enviar = {
        log: {
          admin_id: idUserSession,
          action: "Eliminar usuario",
          target_id: idEliminar,
          details: `Se elimino al usuario: ${nombreEliminar} ${apellidoEliminar} del destacamento`,
        },
      };
      const save_log = async () => {
        try {
          const query = await fetch("http://erv-zona3/backend/logs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(log_data_enviar),
          });
          if (query.ok) {
            Swal.fire({
              title: "Exito",
              text: "Usuario eliminado exitosamente",
              icon: "success",
              confirmButtonText: "Ok",
            });
            setShow(false);
            getUsers();
          }
        } catch (error) {
          console.log(error);
        }
      };
      save_log();
    }
  }, [sent]);

  const eliminarRegistro = async () => {
    const id = { id: idEliminar };
    try {
      const query = await fetch("http://erv-zona3/backend/users/eliminar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      if (query.ok) {
        setSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2>Usuarios</h2>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>n°</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Destacamento</th>
            <th>Rol</th>
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
            data.map((user) => (
              <tr key={user.id}>
                <td>{contador++}</td>
                <td>{user.nombre}</td>
                <td>{user.apellido}</td>
                <td>{user.email}</td>
                <td>{capitalize(user.destacamento)}</td>
                <td>{user.rol}</td>
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
                            `/dashboard/admin/usuarios/editar?id=${user.id}`
                          )
                        }
                        eventKey="1"
                      >
                        Editar
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handleShow({
                            id: user.id,
                            nombre: user.nombre,
                            apellido: user.apellido,
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
          ):(
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
          ¿Estás seguro(a) que deseas eliminar el usuario: {nombreEliminar}{" "}
          {apellidoEliminar}?
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
      <button onClick={() => navigate("/dashboard/admin/usuarios/crear")}>
        Crear Usuario
      </button>
      <button onClick={dowload}>Descargar</button>
    </>
  );
};

export default Usuarios;
