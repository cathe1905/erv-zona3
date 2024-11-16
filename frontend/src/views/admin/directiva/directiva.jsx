import { useEffect } from "react";
import { useState } from "react";
import { capitalize } from "../../../funciones";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
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

      if (result.ok) {
        Swal.fire({
          title: 'Exito',
          text: 'Directivo eliminado exitosamente',
          icon: 'success',
          confirmButtonText: 'Ok'
      });
      setShow(false)
      getDirectiva();
      }
    } catch (error) {
      console.error("Hubo un problema con la solicitud", error);
      console.log(error);
      return;
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
      }
    } catch (error) {
      console.error("Hubo un problema con la solicitud", error);
      console.log(error);
      return;
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
      <h2>Directiva Zonal</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="table-bordered">
        <thead>
          <tr>
            <th>n°</th>
            <th>Nombres</th>
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
                <td colSpan="11" className="text-center">
                  {GrowExample()}
                </td>
              </tr>
          ): Array.isArray(data) && data.length > 0 ? (
            data.map((miembro) => (
              <tr key={miembro.id}>
                <td>{contador++}</td>
                <td>{capitalize(miembro.nombres)}</td>
                <td>{capitalize(miembro.apellidos)}</td>
                <td>{capitalize(miembro.ascenso)}</td>
                <td>{capitalize(miembro.cargo)}</td>
                <td>{capitalize(miembro.telefono)}</td>
                <td><img className="img-fluid" style={{'width': '100px'}} src={`http://erv-zona3/imagenes/${miembro.foto}`} alt="foto del directivo" /></td>
                <td>{capitalize(miembro.destacamento)}</td>
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
                      <Dropdown.Item onClick={() => navigate(`/dashboard/admin/directiva/editar?id=${miembro.id}`)} eventKey="1">Editar</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleShow({ id: miembro.id, nombre: capitalize(miembro.nombres) })} eventKey="2">Eliminar</Dropdown.Item>
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
          <Modal.Title>Eliminar Directivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro(a) que deseas eliminar a {nombreEliminar}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={eliminarRegistro} variant="primary">Si</Button>
        </Modal.Footer>
      </Modal>
      <div className="border">
        <a href="/dashboard/admin/directiva/crear" className="text-decoration-none" style={{cursor: 'pointer'}}>Crear miembro</a>
      </div>
      <button onClick={dowload}>Descargar</button>
      
    </>
  );
};

export default Directiva;
