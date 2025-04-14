import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useExplo } from "../../../hook/useExplo";
import useTreasury from "../../../services/useTreasury";
import GrowExample from "../../../components/GrowExample";

export default function CrearSolicitud() {
  const { state } = useExplo();
  const { getAllPayments, isLoading } = useTreasury();
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [params, setParams] = useState({
    año: currentYear.toString(),
    destacamento_id: "",
  });

  useEffect(() => {
    const fetchPayments = async () => {
      const Payments = await getAllPayments(params);
      setData(Payments.payments);
    };
    if (params.destacamento_id) {
      fetchPayments();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  const handleChange = (e) => {
    setParams({
      ...params,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <div className="row d-flex g-3 my-2">
        <div className="col-md-4 col-lg-3 mb-3">
          <select
            className="form-select letra_muy_pequeña"
            value={params.destacamento_id}
            onChange={handleChange}
            name="destacamento_id"
            id="destacamento_id"
          >
            <option value="">Todos los Destacamentos</option>
            {state.destacamentos.length &&
              state.destacamentos.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.nombre}
                </option>
              ))}
          </select>
        </div>
        <div className="col-md-4 col-lg-2 mb-3 letra_muy_pequeña">
          <select
            className="form-select letra_muy_pequeña"
            value={params.año}
            onChange={handleChange}
            name="año"
            id="año"
          >
            <option key={currentYear - 1} value={currentYear - 1}>
              {currentYear - 1}
            </option>
            <option key={currentYear} value={currentYear}>
              {currentYear}
            </option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center">{GrowExample()}</div>
      ) : data.length ? (
        <div
          className="table-responsive overflow-y-scroll"
          style={{ maxHeight: "400px" }}
        >
          <Table bordered hover className="table-sticky border-top-1">
            <thead className="table-light ">
              <tr className="letra_muy_pequeña text-center">
                <th
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 3,
                    backgroundColor: "#f8f9fa",
                    width: "33px",
                    minWidth: "33px",
                  }}
                >
                  n°
                </th>
                <th
                  style={{
                    position: "sticky",
                    left: "33px",
                    zIndex: 3,
                    backgroundColor: "#f8f9fa",
                    minWidth: "140px",
                    width: "140px",
                  }}
                >
                  Oficial
                </th>
                <th>Ene</th>
                <th>Feb</th>
                <th>Mar</th>
                <th>Abr</th>
                <th>May</th>
                <th>Jun</th>
                <th>Jul</th>
                <th>Ago</th>
                <th>Sept</th>
                <th>Oct</th>
                <th>Nov</th>
                <th>Dic</th>
              </tr>
            </thead>
            <tbody className="letra_muy_pequeña">
              {data.map((oficial, index) => (
                <tr key={oficial.oficial_id}>
                  <td
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      backgroundColor: "white",
                      width: "33px",
                      minWidth: "33px",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      position: "sticky",
                      left: "33px",
                      zIndex: 2,
                      backgroundColor: "white",
                      width: "140px",
                      minWidth: "140px",
                    }}
                  >
                    {oficial.nombre}
                  </td>

                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="month text-center">
                    <input type="checkbox" />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center">
          Escoge un destacamento para iniciar la solicitud
        </div>
      )}
    </>
  );
}
