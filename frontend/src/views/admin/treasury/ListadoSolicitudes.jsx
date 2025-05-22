import { useExplo } from "../../../hook/useExplo";
import useTreasury from "../../../services/useTreasury";
import { useEffect, useState } from "react";
import GrowExample from "../../../components/GrowExample";
import { Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import PaginationGeneral from "../../../components/Pagination";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  monthsArray,
  status,
  formatearFechaHora,
  formatDate,
  evaluation,
  monthsTotalToPayList
} from "./funciones";
import {
  Form,
  InputGroup,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { FaEye, FaHistory, FaPencilAlt } from "react-icons/fa";
import { api } from "../../../funciones";
import { toast } from "react-toastify";

export default function ListadoSolicitudes() {
  const navigate= useNavigate()
  const { state } = useExplo();
  const yearStart = 2025;
  const { getAllPaymentsRequests, getHistoryRequest, isLoading, rejectPaymentRequest, approvedPaymentRequest } = useTreasury();
  const currentYear = new Date().getFullYear();
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [params, setParams] = useState({
    año: "",
    destacamento_id: "",
    page: 1,
    limit: 10,
    mes: "",
    estatus: "",
    id: "",
  });
  const [search, SetSearch] = useState("");
  const [details, setDetails] = useState({
    fecha_solicitud: "",
    solicitud_id: 0,
    destacamento: "",
    responsable: "",
    oficiales: [],
    comprobante: 0,
    monto: 0,
    valor_cuota: 0,
    estatus: "",
    tasa: "",
    total_month: 0
  });
  const handleShowDetail = (request) => {
    setDetails({
      fecha_solicitud: request.fecha_solicitud,
      solicitud_id: request.id,
      destacamento: request.destacamento.nombre,
      responsable: request.responsable,
      oficiales: request.oficiales_meses,
      comprobante: request.comprobante_imagen,
      monto: request.monto,
      valor_cuota: request.valor_cuota,
      estatus: request.estatus,
      tasa: request.tasa,
      total_month: monthsTotalToPayList(request.oficiales_meses)
    });
    setShowDetail(true);
  };
  const [historial, setHistorial] = useState({
    estatus_anterior: "",
    estatus_nuevo: "",
    fecha_cambio: "",
    solicitud_id: 0,
    comentario: "",
  });
  const valor_cuota= 1;
  const [DataPost, setDataPost] = useState({
    id: "",
    id_user: "",
    comment: ""
  })

  const fetchPaymentRequests = async () => {
    const PaymentRequests = await getAllPaymentsRequests(params);
    setData(PaymentRequests.solicitudes);
    setTotal(PaymentRequests.total);
  };
  useEffect(() => {

    fetchPaymentRequests();
  }, [params]);

  useEffect(() => {

    if(showDetail){
      setDataPost((prev) =>({
        ...prev,
        id: details.solicitud_id,
        id_user: state.user_info.id,
      }))
    }
    
  }, [showDetail]);

  const handleHistory = async (id) => {
    const history = await getHistoryRequest(id);

    setHistorial(history);
    setShowHistory(true);
  };

  const handlePage = (newPage) => {
    setParams({
      ...params,
      page: newPage,
    });
  };

  const handleChange = (e) => {
    if (e.target.name === "año" && e.target.value === "") {
      setParams({
        ...params,
        id: "",
        mes: "",
        [e.target.name]: e.target.value,
      });
    } else {
      setParams({
        ...params,
        id: "",
        [e.target.name]: e.target.value,
      });
    }

    SetSearch("");
  };

  const years = useMemo(() => {
    const yearSelect = [];
    for (let i = yearStart; i <= currentYear; i++) {
      yearSelect.push(i);
    }
    return yearSelect;
  }, [currentYear]);

  const handleAllFilters = () => {
    setParams({
      año: "",
      destacamento_id: "",
      estatus: "",
      mes: "",
      page: 1,
      limit: 10,
      id: "",
    });

    SetSearch("");
  };

  const handleSearch = () => {
    setParams({
      año: "",
      destacamento_id: "",
      estatus: "",
      mes: "",
      page: 1,
      limit: 10,
      id: search,
    });
  };
  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  const handleRejectRequest= async () => {

    if(DataPost.comment === ""){
      toast.error('El campo comentario es obligatorio.')
      return;
    }
    const result= await rejectPaymentRequest(DataPost)

    if(result){
      toast.success('Solicitud rechazada exitosamente.')
      fetchPaymentRequests()
    }else{
      toast.error('Ocurrió un error, contacte a soporte.')
    }

    setShowDetail(false)
  }

  const handleApprovedRequest = async () =>{
    const result= await approvedPaymentRequest(DataPost)

    if(result === true){
      toast.success('Solicitud aprobada exitosamente.')
      fetchPaymentRequests()
    }else{
      toast.error('Ocurrió un error, contacte a soporte.')
    }

    setShowDetail(false)
  }

  return (
    <>
      <div className="row d-flex g-3 mt-3">
        <div className="col-md-2 mb-3">
          <select
            className="form-select letra_muy_pequeña"
            value={params.estatus}
            onChange={handleChange}
            name="estatus"
            id="estatus"
          >
            <option value="">Todos los estatus</option>
            {status.map((item) => (
              <option key={item.id} value={item.id}>
                {item.value}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 mb-3">
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
        <div className="col-md-1 mb-3 letra_muy_pequeña">
          <select
            className="form-select letra_muy_pequeña"
            value={params.año}
            onChange={handleChange}
            name="año"
            id="año"
          >
            <option value="">Año</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 mb-3 letra_muy_pequeña">
          <select
            className="form-select letra_muy_pequeña"
            value={params.mes}
            onChange={handleChange}
            name="mes"
            id="mes"
            disabled={params.año === ""}
          >
            <option value="">--Seleciona un mes--</option>
            {monthsArray.map((month) => (
              <option key={month.id} value={month.id}>
                {month.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-1">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-download">Número de resultados</Tooltip>
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
        <div className="col-md-2">
          <InputGroup className="mb-3 letra_muy_pequeña">
            <Form.Control
              type="text"
              placeholder="N° de solicitud"
              aria-label="Buscar"
              onChange={(e) => SetSearch(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch(e)}
              value={search}
              className="letra_muy_pequeña"
            />
            <Button
              variant="outline-secondary"
              id="button-search"
              onClick={handleSearch}
            >
              <FaSearch />
            </Button>
          </InputGroup>
        </div>
        <div className="col-md-2">
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
          <Table bordered hover className="letra_muy_pequeña">
            <thead className="table-light text-center">
              <tr>
                <th>#</th>
                <th>Destacamento</th>
                <th>Fecha</th>
                <th>Nº de solicitud</th>
                <th>Responsable</th>
                <th>Monto</th>
                <th>Valor cuota</th>
                <th>Estatus</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {data.map((request, index) => (
                <tr key={request.id}>
                  <td>{(params.page - 1) * params.limit + index + 1}</td>
                  <td>{request.destacamento.nombre}</td>
                  <td>{formatDate(request.fecha_solicitud)}</td>
                  <td>{request.id} </td>
                  <td>
                    {request.responsable.nombres}{" "}
                    {request.responsable.apellidos}{" "}
                  </td>
                  <td>{request.monto}</td>
                  <td>{request.valor_cuota}</td>
                  <td>
                    {
                      status.filter((item) => item.id === request.estatus)[0]
                        .value
                    }
                  </td>
                  <td className="d-flex justify-content-center">
                    <Button
                      variant="link"
                      onClick={() => handleShowDetail(request)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      disabled={request.estatus === "pending"}
                      onClick={() => handleHistory(request.id)}
                      variant="link"
                    >
                      <FaHistory />
                    </Button>
                     <Button
                      disabled={request.estatus !== "pending"}
                      onClick={() => navigate(`/dashboard/admin/tesoreria/solicitudes/editar?id=${request.id}`)}
                      variant="link"
                    >
                      <FaPencilAlt />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Modal
            show={showHistory}
            onHide={handleCloseHistory}
            backdrop="static"
            keyboard={false}
            className="letra_muy_pequeña"
          >
            <Modal.Header closeButton>
              <Modal.Title>Historial de solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">N° de solicitud:</p>
                  <p>{historial.solicitud_id}</p>
                </div>
                <div className="d-flex gap-2">
                  <p className="fw-bold">Comentario</p>
                  <p>
                    {historial.comentario === ""
                      ? "Sin comentarios"
                      : historial.comentario}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">Estatus anterior:</p>
                  <p>
                    {
                      status.filter(
                        (item) => item.id === historial.estatus_anterior
                      )[0]?.value
                    }
                  </p>
                </div>
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">Estatus nuevo:</p>
                  <p>
                    {
                      status.filter(
                        (item) => item.id === historial.estatus_nuevo
                      )[0]?.value
                    }
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <p className="fw-bold">Fecha de cambio</p>
                <p>{formatearFechaHora(historial.fecha_cambio)}</p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseHistory}>
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showDetail}
            onHide={handleCloseDetail}
            backdrop="static"
            keyboard={false}
            className="letra_muy_pequeña"
          >
            <Modal.Header closeButton>
              <Modal.Title>Detalle de solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">N° de solicitud:</p>
                  <p>{details.solicitud_id}</p>
                </div>

                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">Destacamento:</p>
                  <p>{details.destacamento}</p>
                </div>
              </div>

              <div className="row">
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">Responsable:</p>
                  <p>
                    {details.responsable.nombres}{" "}
                    {details.responsable.apellidos}
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2" style={{maxHeight: "300px", overflowY: "scroll"}}>
                <Table bordered className="table-responsive overflow-y-scroll">
                  <thead>
                    <tr>
                      <th>Oficiales</th>
                      <th>Meses</th>
                    </tr>
                  </thead>
                  <tbody>

                    {details.oficiales.length > 0 && (
                      evaluation(details.oficiales)?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {item.nombre_apellido}
                          </td>
                          <td>{item.meses.join(', ')}</td>
                        </tr>
                      ))
                    )}
                    
                  </tbody>
                </Table>
              </div>
              <div className="text-center my-3">
                <img
                  src={`${api}imagenes/${details.comprobante}`}
                  alt="Comprobante"
                  className="img-fluid rounded shadow-sm border"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />
              </div>
              <div className="row">
                <div className="d-flex gap-2 col-3">
                  <p className="fw-bold">Monto:</p>
                  <p>{details.monto}</p>
                </div>

                <div className="d-flex gap-2 col-3">
                  <p className="fw-bold">Tasa:</p>
                  <p>{details.tasa}</p>
                </div>
                <div className="d-flex gap-2 col-6">
                  <p className="fw-bold">Total meses a pagar:</p>
                  <p>{details.total_month}</p>
                </div>
              </div>
              <div className="d-flex gap-2 ">
                <p className="fw-bold">Monto calculado a pagar:</p>
                <p>
                $ {details.total_month * valor_cuota} ={" "}
                  {(
                    Number(details.tasa) *
                    details.total_month *
                    valor_cuota
                  ).toLocaleString("es-VE", { style: "currency", currency: "VES" })}{" "}
                </p>
              </div>
              {details.estatus === "pending" && (
                <div className="mt-3">
                  <textarea
                  minLength={20}
                  name="comment"
                  onChange={(e) => setDataPost({...DataPost, comment: e.target.value})}
                  value={DataPost.comment}
                    className="form-control mb-3"
                    style={{ height: "60px", fontSize: "0.9rem" }}
                    placeholder="Escribe un comentario, en caso de rechazar la solicitud."
                  ></textarea>
                  <div className="d-flex gap-2">
                    <Button onClick={handleApprovedRequest} variant="success">Aprobar</Button>
                    <Button onClick={handleRejectRequest} variant="danger">Rechazar</Button>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDetail}>
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>
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
