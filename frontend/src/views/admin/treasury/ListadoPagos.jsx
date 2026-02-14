import { useEffect, useMemo, useState } from "react";
import useTreasury from "../../../services/useTreasury";
import GrowExample from "../../../components/GrowExample";
import { MapPaidMonths, evaluateStatus, months, formatDate } from "./funciones";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useExplo } from "../../../hook/useExplo";
import PaginationGeneral from "../../../components/Pagination";
import { FaCircle } from 'react-icons/fa';
import { Tooltip, OverlayTrigger, Table } from "react-bootstrap";

export default function ListadoPagos() {
  const {state} = useExplo();
  const yearStart= 2025
  const currentYear= new Date().getFullYear()
  const { getAllPayments, isLoading } = useTreasury();
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState({
    oficial: "",
    fecha_pago: "",
    mes: 0,
    monto: 0,
    responsable: "",
    solicitud_id: 0,
  });
  const [params, setParams] = useState({
    año: currentYear.toString(),
    destacamento_id: "",
    nombre: "",
    page: 1,
    limit: 10
  })
  const[total, setTotal]= useState(0)


  const handleClose = () => {
    setShow(false);
    setDetails({
      fecha_pago: "",
      mes: 0,
      monto: 0,
      responsable: "",
      solicitud_id: 0,
    })
  };
  const handleShow = (months, month, oficial) => {
    if (!Array.isArray(months) || months.length === 0) {
      return;
    }
    setShow(true);
    const monthRequired = months.find((item) => item.mes === month);
    setDetails({...monthRequired, oficial: oficial});
  };

  useEffect(() => {
    const fetchPayments = async () => {
      const Payments = await getAllPayments(params);
      console.log(Payments)
      setData(Payments.payments);
      setTotal(Payments.total)
    };
    fetchPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleChange = (e) =>{
     setParams({
      ...params,
      [e.target.name] : e.target.value
     })
  }

  const years= useMemo(() => {

    const yearSelect= [];
    for(let i=yearStart ; i <= currentYear; i++){
      yearSelect.push(i)
    }
    return yearSelect
  },[currentYear])

  const handlePage = (newPage) => {
    setParams({
      ...params,
      page : newPage
     })
  };

  const handleAllFilters = () =>{
    setParams(
      {
        año: currentYear.toString(),
        destacamento_id: "",
        nombre: "",
        page: 1,
        limit: 10
      }
    )
  }


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
                  {(dest.nombre)}
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
              {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
        </div>
        <div className="col-md-4 col-lg-2">
          <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-download">
                  Número de resultados
                </Tooltip>
              }
            >
              <select
                  className="form-select letra_muy_pequeña"
                  value={params.limit}
                  name="limit"
                  id="limit"
                  onChange={handleChange}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
              </select>
            </OverlayTrigger>
          </div>
          <div className="col-md-4 col-lg-3">
            <input
              type="text"
              className="form-control letra_muy_pequeña"
              placeholder="Buscar por un nombre"
              name="nombre"
              onChange={handleChange}
              value={params.nombre}
            />
          </div>
          <div className="col-md-4 col-lg-2">
            <button
              className="btn btn-outline-secondary w-100 letra_muy_pequeña"
              onClick={handleAllFilters}
            >
              Limpiar filtros
            </button>
          </div>
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center">{GrowExample()}</div>
      ) : data.length ? (
        <div>
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
                <th>Estatus</th>
                <th>Destacamento</th>
                <th>Enero</th>
                <th>Febrero</th>
                <th>Marzo</th>
                <th>Abril</th>
                <th>Mayo</th>
                <th>Junio</th>
                <th>Julio</th>
                <th>Agosto</th>
                <th>Septiem.</th>
                <th>Octubre</th>
                <th>Noviem.</th>
                <th>Diciem.</th>
                
              </tr>
            </thead>
            <tbody className="letra_muy_pequeña">
              {data ? (
                data.map((oficial, index) => (
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
                      {(params.page - 1) * params.limit + index + 1}
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
                    {evaluateStatus(oficial.meses_pagados) === "Solvente" ? (
                      <td>
                        <FaCircle color="green" className="me-1"/>
                        <span>Solvente</span>
                      </td>
                    ) : (
                      <td>
                        <FaCircle color="red" className="me-1"/>
                        <span>Insolvente</span>
                      </td>
                    )}
                    <td>{oficial.destacamento_nombre}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 1, oficial.nombre)}> {MapPaidMonths(oficial.meses_pagados, 1)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 2, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 2)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 3, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 3)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 4, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 4)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 5, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 5)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 6, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 6)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 7, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 7)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 8, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 8)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 9, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 9)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 10, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 10)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 11, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 11)}</td>
                    <td className="month" onClick={() => handleShow(oficial.meses_pagados, 12, oficial.nombre)}>{MapPaidMonths(oficial.meses_pagados, 12)}</td>
                    
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
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            className="letra_muy_pequeña"
          >
            <Modal.Header closeButton>
              <Modal.Title>Detalle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">Oficial:</p>
                  <p>{details.oficial}</p>
                </div>
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">Mes:</p>
                  <p>{months[details.mes]}</p>
                </div>
              </div>
            
              <div className="row">
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">Fecha de pago:</p>
                  <p>{formatDate(details.fecha_pago)}</p>
                </div>
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">Núm. de solicitud:</p>
                  <p>{details.solicitud_id}</p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <p className="fw-bold">¿Quién ejecutó el pago?:</p>
                <p>{details.responsable}</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>
           
        </div>
        {total > 0 && (
            <div className="d-flex justify-content-end">
              <PaginationGeneral
                total={total}
                current_page={params.page}
                limit={params.limit}
                onSelectPage={handlePage}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-center">No se encontraron resultados</p>
      )}
    </>
  );
}
