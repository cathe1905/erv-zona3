import { Table, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useExplo } from "../../../hook/useExplo";
import useTreasury from "../../../services/useTreasury";
import GrowExample from "../../../components/GrowExample";
import Input from "./Input";
import { toast } from "react-toastify";
import { MdBlock } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import SummaryMonths from "./SummaryMonths";
import { monthsTotalToPay } from "./funciones";

export default function CrearSolicitud() {
  const { state } = useExplo();
  const [show, setShow] = useState(false);
  const { getAllPayments, isLoading, newPaymentRequest } = useTreasury();
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [params, setParams] = useState({
    año: currentYear.toString(),
    destacamento_id: "",
  });
  const InicialDataPost = {
    solicitudes: {
      responsable_id: "",
      destacamento_id: "",
      comprobante_imagen: "",
      oficiales_ids: { oficiales: [] },
      relaciones_oficiales_meses: {},
      monto: "",
      valor_cuota: "1",
      tasa: "",
      referencia: "",
    },
  };
  const sendNewPaymentRequest = async (dataToSend) =>{
    const response = await newPaymentRequest(JSON.stringify(dataToSend))

    if(response){
      toast.success('Solicitud creada correctamente')
    }else{
      toast.error('Ocurrió un error al crear la solicitud, por favor contacte a soporte.')
    }
    setShow(false)
    setDataPost(InicialDataPost)
    setAllInputs({})
    setAllInputsMonths(initialMonthsState)
    setAllInputsOficiales(initialOficialIdState)
    setSummaryModal({})
    setTotalToPay(0)
  }
  const [DataPost, setDataPost] = useState(InicialDataPost);
  const initialMonthsState = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, false])
  );

  const initialOficialIdState = Object.fromEntries(
    data.map((item) => [item.oficial_id, false])
  );

  const [allInputs, setAllInputs] = useState({});
  const [allInputsMonh, setAllInputsMonths] = useState(initialMonthsState);
  const [allInputsOficiales, setAllInputsOficiales] = useState({
    initialOficialIdState,
  });
  const [SummaryModal, setSummaryModal] = useState({});
  const [totalToPay, setTotalToPay] = useState(0);

  const handleClose = () => {
    setShow(false);
    setSummaryModal({});
  };

  useEffect(() => {
    const fetchPayments = async () => {
      const Payments = await getAllPayments(params);
      setData(Payments.payments);
    };
    if (params.destacamento_id) {
      fetchPayments();
      setDataPost((prev) => ({
        ...prev,
        solicitudes: {
          ...prev.solicitudes,
          responsable_id: state.user_info.id,
          destacamento_id: params.destacamento_id,
        },
      }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (DataPost.solicitudes.oficiales_ids.oficiales.length > 0) {
      setSummaryModal({ data, DataPost });
      setShow(true);
      const total = monthsTotalToPay(
        DataPost.solicitudes.relaciones_oficiales_meses
      );
      setTotalToPay(total);
    }
  }, [DataPost]);

  const handleChangeParams = (e) => {
    setParams({
      ...params,
      [e.target.name]: e.target.value,
    });
    setDataPost(InicialDataPost);
  };

  const handleChange = (e) => {
    setDataPost((prev) => ({
      ...prev,
      solicitudes: {
        ...prev.solicitudes,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setDataPost((prev) => ({
          ...prev,
          solicitudes: {
            ...prev.solicitudes,
            comprobante_imagen: base64Image,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInput = (e, key) => {
    if (e.target.checked) {
      setAllInputs((prev) => ({
        ...prev,
        [key]: true,
      }));
    } else {
      setAllInputs((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newInputs = Object.fromEntries(
        Object.entries(allInputs).map(([key]) => [key, true])
      );
      setAllInputs(newInputs);
      setAllInputsMonths(initialMonthsState); //desmarca los inputs de meses
      setAllInputsOficiales(initialOficialIdState); //desmarca los inputs de oficiales
    } else {
      const resetInputs = Object.fromEntries(
        Object.entries(allInputs).map(([key]) => [key, false])
      );
      setAllInputs(resetInputs);
    }
  };

  const handleOneMonthAllOfic = (e, month) => {
    data.forEach((oficial) => {
      if (!oficial.meses_pagados.some((oficial) => oficial.mes === month)) {
        if (e.target.checked) {
          setAllInputs((prev) => ({
            ...prev,
            [`${oficial.oficial_id}-${month}`]: true,
          }));
          setAllInputsMonths((prev) => ({
            ...prev,
            [month]: true,
          }));
        } else {
          setAllInputs((prev) => ({
            ...prev,
            [`${oficial.oficial_id}-${month}`]: false,
          }));
          setAllInputsMonths((prev) => ({
            ...prev,
            [month]: false,
          }));
        }
      } else {
        return;
      }
    });
  };

  const handleOneOficAllMonths = (e, id) => {
    const oficial = data.find((oficial) => oficial.oficial_id === id);

    for (let i = 1; i <= 12; i++) {
      if (!oficial.meses_pagados.some((month) => month.mes === i)) {
        if (e.target.checked) {
          setAllInputs((prev) => ({
            ...prev,
            [`${oficial.oficial_id}-${i}`]: true,
          }));
          setAllInputsOficiales((prev) => ({
            ...prev,
            [id]: true,
          }));
        } else {
          setAllInputs((prev) => ({
            ...prev,
            [`${oficial.oficial_id}-${i}`]: false,
          }));
          setAllInputsOficiales((prev) => ({
            ...prev,
            [id]: false,
          }));
        }
      }
    }
  };

  //extrae los inputs con value true y los agrupa con el id correspondiente
  const getTrueInputs = (inputs) => {
    const trueInputs = {};
    for (const [key, value] of Object.entries(inputs)) {
      if (value === true) {
        const keySplited = key.split("-");
        if (trueInputs[keySplited[0]]) {
          trueInputs[keySplited[0]] = [
            ...trueInputs[keySplited[0]],
            Number(keySplited[1]),
          ];
        } else {
          trueInputs[keySplited[0]] = [Number(keySplited[1])];
        }
      }
    }
    return trueInputs;
  };

  //evalua que no hayan meses intercalados sin marcar (la seleccion de inputs escogida)
  const SelectedConsecutiveMonths = (TrueInputs) => {
    for (const [key, value] of Object.entries(TrueInputs)) {
      const orderArray = [...value].sort((a, b) => a - b);

      // Comenzar desde el segundo elemento (índice 1)
      for (let i = 1; i < orderArray.length; i++) {
        if (orderArray[i] - orderArray[i - 1] !== 1) {
          return [true, key]; // Hay huecos
        }
      }
      //si es 1, los meses a pagar comienzan desde enero, no hace falta verificar si tiene meses pagados
      if (orderArray[0] !== 1) {
        //busco el array de meses pagados de ese oficial
        const paidMonthList = data.find((of) => of.oficial_id === key);
        if (paidMonthList.meses_pagados.length) {
          for (let i = 1; i < orderArray[0]; i++) {
            if (!paidMonthList.meses_pagados.some((month) => month.mes === i)) {
              return [true, key];
            }
          }
        } else {
          //si viene vacio y no comienza desde enero, entonces hay meses vacios
          return [true, key];
        }
      }
    }
    return false;
  };
  const FormatedDatePost = (idInputs) => {
    const nuevos_oficiales = Object.keys(idInputs);
    const nuevas_relaciones = {};

    for (const [key, value] of Object.entries(idInputs)) {
      nuevas_relaciones[key] = value.map(
        (month) => `${params.año}-${month.toString().padStart(2, "0")}-01`
      );
    }

    setDataPost((prev) => ({
      ...prev,
      solicitudes: {
        ...prev.solicitudes,
        oficiales_ids: { oficiales: nuevos_oficiales },
        relaciones_oficiales_meses: nuevas_relaciones,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trueInputs = getTrueInputs(allInputs);

    //validaciones de campos de texto
    if (
      DataPost.monto === "" ||
      DataPost.tasa === "" ||
      DataPost.referencia === "" ||
      DataPost.comprobante_imagen === ""
    ) {
      toast.error("Todos los campos son obligatorios", {
        icon: <MdBlock color="white" size={20} />,
        className: "bg-danger text-white",
        autoClose: false,
      });
      return;
    }

    //validaciones del grupo de inputs
    const result = SelectedConsecutiveMonths(trueInputs);

    if (result[0]) {
      const oficial = data.find((of) => of.oficial_id === result[1]);
      toast.error(
        `Errores con: ${oficial.nombre}, no se permite seleccionar un mes y dejar vacío un mes anterior.`,
        {
          icon: <MdBlock color="white" size={20} />,
          className: "bg-danger text-white",
          autoClose: false,
        }
      );
      return;
    }

    //creando el formato de fechas para el objeto final
    FormatedDatePost(trueInputs);
  };

  return (
    <>
      <div className="row d-flex g-3 my-2">
        <div className="col-lg-3 mb-3">
          <select
            className="form-select letra_muy_pequeña"
            value={params.destacamento_id}
            onChange={handleChangeParams}
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
        <div className="col-md-2 col-lg-2 mb-3 letra_muy_pequeña">
          <select
            className="form-select letra_muy_pequeña"
            value={params.año}
            onChange={handleChangeParams}
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
        {params.destacamento_id && (
          <div className="col-md-4 col-lg-5">
            <input
              className="me-2"
              id="select-all"
              type="checkbox"
              onChange={handleSelectAll}
            />
            <label htmlFor="select-all">
              Seleccionar todos los oficiales y todos los meses
            </label>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center">{GrowExample()}</div>
      ) : data.length ? (
        <>
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
                  <th>
                    <input
                      checked={allInputsMonh[1]}
                      type="checkbox"
                      onChange={(e) => handleOneMonthAllOfic(e, 1)}
                    />{" "}
                    Ene
                  </th>
                  <th>
                    <input
                      checked={allInputsMonh[2]}
                      type="checkbox"
                      onChange={(e) => handleOneMonthAllOfic(e, 2)}
                    />{" "}
                    Feb
                  </th>
                  <th>
                    <input
                      checked={allInputsMonh[3]}
                      type="checkbox"
                      onChange={(e) => handleOneMonthAllOfic(e, 3)}
                    />{" "}
                    Mar
                  </th>
                  <th>
                    <input
                      type="checkbox"
                      checked={allInputsMonh[4]}
                      onChange={(e) => handleOneMonthAllOfic(e, 4)}
                    />{" "}
                    Abr
                  </th>
                  <th>
                    <input
                      type="checkbox"
                      checked={allInputsMonh[5]}
                      onChange={(e) => handleOneMonthAllOfic(e, 5)}
                    />{" "}
                    May
                  </th>
                  <th>
                    <input
                      type="checkbox"
                      checked={allInputsMonh[6]}
                      onChange={(e) => handleOneMonthAllOfic(e, 6)}
                    />{" "}
                    Jun
                  </th>
                  <th>
                    <input
                      type="checkbox"
                      checked={allInputsMonh[7]}
                      onChange={(e) => handleOneMonthAllOfic(e, 7)}
                    />{" "}
                    Jul
                  </th>
                  <th>
                    <input
                      type="checkbox"
                      checked={allInputsMonh[8]}
                      onChange={(e) => handleOneMonthAllOfic(e, 8)}
                    />{" "}
                    Ago
                  </th>
                  <th>
                    <input
                      type="checkbox"
                      checked={allInputsMonh[9]}
                      onChange={(e) => handleOneMonthAllOfic(e, 9)}
                    />{" "}
                    Sept
                  </th>
                  <th>
                    <input
                      type="checkbox"
                      checked={allInputsMonh[10]}
                      onChange={(e) => handleOneMonthAllOfic(e, 10)}
                    />{" "}
                    Oct
                  </th>
                  <th>
                    <input
                      type="checkbox"
                      checked={allInputsMonh[11]}
                      onChange={(e) => handleOneMonthAllOfic(e, 11)}
                    />{" "}
                    Nov
                  </th>
                  <th>
                    <input
                      type="checkbox"
                      checked={allInputsMonh[12]}
                      onChange={(e) => handleOneMonthAllOfic(e, 12)}
                    />{" "}
                    Dic
                  </th>
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
                      <input
                        checked={allInputsOficiales[oficial.oficial_id]}
                        type="checkbox"
                        onChange={(e) =>
                          handleOneOficAllMonths(e, oficial.oficial_id)
                        }
                      />{" "}
                      {oficial.nombre} {""} {oficial.oficial_id}
                    </td>

                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <td key={month} className="month text-center">
                          <Input
                            months={oficial.meses_pagados}
                            month={month}
                            id={oficial.oficial_id}
                            allInputs={allInputs}
                            setAllInputs={setAllInputs}
                            handleInput={handleInput}
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <form
            onSubmit={handleSubmit}
            className="row d-flex justify-content-center align-items-center letra_muy_pequeña g-2"
          >
            <div className="col-md-3 d-flex justify-content-center">
              <label className="btn btn-secondary letra_muy_pequeña mb-0">
                📁 Seleccionar archivo
                <input
                  required
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="col-md-2 d-flex align-items-center">
              <label
                className="me-2 mb-0 w-50 text-end"
                htmlFor="comprobante_imagen"
              >
                Monto total:
              </label>
              <input
                required
                onChange={handleChange}
                value={DataPost.solicitudes.monto}
                name="monto"
                className="form-control form-control-sm w-50"
                type="text"
                placeholder="bs."
              />
            </div>

            <div className="col-md-2 d-flex align-items-center">
              <label className="me-2 mb-0 w-25 text-end" htmlFor="tasa">
                Tasa:
              </label>
              <input
                required
                onChange={handleChange}
                value={DataPost.solicitudes.tasa}
                name="tasa"
                className="form-control form-control-sm w-75"
                type="text"
                placeholder="Ejemplo 0.95"
              />
            </div>

            <div className="col-md-3 d-flex align-items-center">
              <label className="me-2 mb-0 w-50 text-end" htmlFor="digitos">
                Últimos 4 dígitos:
              </label>
              <input
                required
                onChange={handleChange}
                value={DataPost.solicitudes.referencia}
                name="referencia"
                className="form-control form-control-sm w-50"
                type="text"
                placeholder="Ej. 1234"
              />
            </div>

            <div className="col-md-2 d-flex justify-content-center">
              <input
                required
                className="btn btn-primary letra_muy_pequeña"
                type="submit"
                value="Enviar Solicitud"
              />
            </div>
          </form>
          <Modal
            show={show}
            onHide={handleClose}
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
                  {SummaryModal.length && (
                     state.destacamentos.find(
                      (dest) =>
                        dest.id === DataPost?.solicitudes?.destacamento_id
                    ).nombre
                  )
                   
                  }
                </p>
                <p className="col-6">
                  Responsable: {state.user_info.nombre}{" "}
                  {state.user_info.apellido}
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
                    <SummaryMonths
                      data={SummaryModal.data}
                      DataPost={SummaryModal.DataPost}
                    />
                  </tbody>
                </Table>
              </div>
              <div
                style={{ height: "200px", width: "auto" }}
                className="d-flex justify-content-center my-2"
              >
                <img
                  className="img-fluid"
                  src={SummaryModal?.DataPost?.solicitudes?.comprobante_imagen}
                  alt="comprobante"
                />
              </div>
              <div className="row">
                <div className="col-md-7 d-flex text-start">
                  <p className="pe-2 fw-bold">Monto en transferencia:</p>{" "}
                  <p>{SummaryModal?.DataPost?.solicitudes?.monto} bs.</p>
                </div>
                <div className="col-md-5 d-flex">
                  <p className="pe-2 fw-bold">Valor Cuota:</p>{" "}
                  <p>{SummaryModal?.DataPost?.solicitudes?.valor_cuota} $.</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 d-flex text-start">
                  <p className="pe-2 fw-bold">Tasa:</p>{" "}
                  <p>{SummaryModal?.DataPost?.solicitudes?.tasa} bs.</p>
                </div>
                <div className="col-md-8 d-flex text-start">
                  <p className="pe-2 fw-bold">Monto calculado a pagar:</p>{" "}
                  <p>
                    {totalToPay *
                      SummaryModal?.DataPost?.solicitudes?.valor_cuota}{" "}
                    $. ={" "}
                    {SummaryModal?.DataPost?.solicitudes?.tasa *
                      (totalToPay *
                        SummaryModal?.DataPost?.solicitudes?.valor_cuota)} bs.
                  </p>
                </div>
              </div>
              <p className="text-center">Asegurate de que el monto calculado coincida con el monto de tu transferencia.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Volver
              </Button>
              <Button onClick={() => sendNewPaymentRequest(DataPost)} variant="primary">
                Enviar solicitud
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <div className="text-center">
          Escoge un destacamento para iniciar la solicitud
        </div>
      )}
    </>
  );
}
