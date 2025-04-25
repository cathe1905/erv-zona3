import React from "react";
import { Button, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {
  RequestActions,
  RequestStateTypes,
} from "./reducer/SolicitudesReducer";
import { useExplo } from "../../../hook/useExplo";
import useTreasury from "../../../services/useTreasury";
import { toast } from "react-toastify";
import { DataPostType } from "./reducer/types";

type SummaryModalType = {
  paymentsState: RequestStateTypes;
  dispatch: React.Dispatch<RequestActions>;
};

export default function SummaryModal({ paymentsState, dispatch}: SummaryModalType) {
  const { state } = useExplo();
    const { newPaymentRequest } = useTreasury();

  const sendNewPaymentRequest = async (dataToSend: DataPostType) => {
    const response = await newPaymentRequest(dataToSend);

    if (response) {
      toast.success("Solicitud creada correctamente");
    } else {
      toast.error(
        "Ocurrió un error al crear la solicitud, por favor contacte a soporte."
      );
    }
    dispatch({type:"resetAll"})
    dispatch({ type: "hideModal" })
  };

  return (
    <Modal
      show={paymentsState.show}
      onHide={() => dispatch({ type: "hideModal" })}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirma los datos antes de enviar...</Modal.Title>
      </Modal.Header>
      <Modal.Body className="letra_muy_pequeña">
        <div className="row">
          <p className="col-6">
            Destacamento:{" "}
            {
              state.destacamentos.find(
                (dest) =>
                  dest.id ===
                  paymentsState.DataPost?.solicitudes?.destacamento_id
              ).nombre
            }
          </p>
          <p className="col-6">
            Responsable: {state.user_info.nombre} {state.user_info.apellido}
          </p>
        </div>
        <div
          className="table-responsive overflow-y-scroll"
          style={{ maxHeight: "280px" }}
        >
          <Table bordered>
            <thead>
              <tr>
                <th>Oficiales</th>
                <th>Meses a pagar</th>
              </tr>
            </thead>
            <tbody>
              {paymentsState?.summaryMonths?.map((oficial, index) => (
                <tr key={index}>
                  <td>{oficial.nombre_apellido}</td>
                  <td>{oficial.meses.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div
          style={{ height: "200px", width: "auto" }}
          className="d-flex justify-content-center my-2"
        >
          <img
            className="img-fluid"
            src={paymentsState?.DataPost?.solicitudes?.comprobante_imagen}
            alt="comprobante"
          />
        </div>
        <div className="row">
          <div className="col-md-7 d-flex text-start">
            <p className="pe-2 fw-bold">Monto en transferencia:</p>{" "}
            <p>{paymentsState?.DataPost?.solicitudes?.monto} bs.</p>
          </div>
          <div className="col-md-5 d-flex">
            <p className="pe-2 fw-bold">Valor Cuota:</p>{" "}
            <p>{paymentsState?.DataPost?.solicitudes?.valor_cuota} $.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 d-flex text-start">
            <p className="pe-2 fw-bold">Tasa:</p>{" "}
            <p>{paymentsState?.DataPost?.solicitudes?.tasa} bs.</p>
          </div>
          <div className="col-md-8 d-flex text-start">
            <p className="pe-2 fw-bold">Monto calculado a pagar:</p>{" "}
            <p>
              {paymentsState.totalMonthstoPay * Number(paymentsState?.DataPost?.solicitudes?.valor_cuota)} $.
              ={" "}
              {Number(paymentsState?.DataPost?.solicitudes?.tasa) *
                (paymentsState.totalMonthstoPay *
                  Number(paymentsState?.DataPost?.solicitudes?.valor_cuota))}{" "}
              bs.
            </p>
          </div>
        </div>
        <p className="text-center">
          Asegurate de que el monto calculado coincida con el monto de tu
          transferencia.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch({ type: "hideModal" })}>
          Volver
        </Button>
        <Button
          onClick={() => sendNewPaymentRequest(paymentsState.DataPost)}
          variant="primary"
        >
          Enviar solicitud
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
