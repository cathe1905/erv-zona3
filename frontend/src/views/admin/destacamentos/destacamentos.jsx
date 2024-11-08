import { useEffect } from "react";
import { useState } from "react";
import { capitalize } from "../../../../funciones";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const Destacamentos = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getDestacamentos = async () => {
      try {
        const result = await fetch("http://erv-zona3/backend/destacamentos");

        if (result.ok) {
          const respuesta = await result.json();
          setData(respuesta);
        }
      } catch (error) {
        console.error("Hubo un problema con la solicitud", error);
        console.log(error);
        return;
      }
    };
    getDestacamentos();
  }, []);

  return (
    <>
      <h2>Destacamentos</h2>
      <table className="table-bordered">
        <thead>
          <tr>
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
          {Array.isArray(data) && data.length > 0 ? (
            data.map((dest) => (
              <tr key={dest.id}>
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
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      . . .
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="1">Editar</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Eliminar</Dropdown.Item>
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
      <div className="border">
        <a className="text-decoration-none" style={{cursor: 'pointer'}}>Crear Destacamento</a>
      </div>
      
    </>
  );
};

export default Destacamentos;
