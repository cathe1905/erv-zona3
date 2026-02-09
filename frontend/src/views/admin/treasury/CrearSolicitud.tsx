import { Table } from "react-bootstrap";
import { useEffect, useReducer} from "react";
import { useExplo } from "../../../hook/useExplo";
import useTreasury from "../../../services/useTreasury";
import GrowExample from "../../../components/GrowExample";
import Input from "./Input";
import { toast } from "react-toastify";
import {
  paymentsRequestReducer,
  RequestState,
} from "./reducer/SolicitudesReducer";
import SummaryModal from "./Modal";
import { monthsAbrev } from "./funciones";

export default function CrearSolicitud() {

  const [paymentsState, dispatch] = useReducer(paymentsRequestReducer,RequestState);
  const { state } = useExplo();
  const { getAllPayments, isLoading, hasPendingRequest} = useTreasury();
  const currentYear = new Date().getFullYear();


  useEffect(() => {

    // Si el reducer detectó errores de validación (ej: meses seleccionados no consecutivos).
    if (paymentsState.errors.length > 0) {

      // Si hay muchos oficiales con error, mostramos un mensaje genérico.
      if(paymentsState.errors.length > 4){
        toast.error(
          'Se encontraron errores con varios oficiales, no se permite seleccionar un mes y dejar vacío un mes anterior.', {
            autoClose: 10000, 
          },)
      }
      // Si son pocos, mostramos los nombres de los oficiales con error.
      else{
        const oficiales= paymentsState.errors.map(id =>{
          return paymentsState.PaidData.find(oficial => oficial.oficial_id === id).nombre
        }).join(', ')
        toast.error(
          `Errores con los siguientes oficiales: ${oficiales}. No se permite seleccionar un mes y dejar vacío un mes anterior.`, {
            autoClose: 20000, 
          },
        )
      }
      // Limpiamos errores y detenemos loading luego de notificar.
      dispatch({type: "resetErrors"})
      dispatch({type: "toogleLoading", payload: {value: false}})
    }
  }, [paymentsState.errors])

  useEffect(() =>{

    // Cuando ya existe la relación oficial-mes en la data a enviar,
    // significa que la validación fue exitosa y podemos mostrar el resumen
    if(paymentsState?.DataPost?.solicitudes?.relaciones_oficiales_meses){

      dispatch({type: "setSummaryMonths"}) // Agrupa meses seleccionados
      dispatch({type: "setTotalMonthsToPay"}) // Calcula total de meses
      dispatch({type: "openModal"}) // Abre modal de confirmación
    }

  },[paymentsState?.DataPost?.solicitudes?.relaciones_oficiales_meses])
  
  useEffect(() => {
    const checkAndFetch = async () => {
      
      // Reiniciamos el estado cada vez que cambian los parámetros (destacamento/año).
      dispatch({ type: "resetAll" });

      // Solo continuamos si hay un destacamento seleccionado.
      if (paymentsState.params.destacamento_id) {

        // Verificamos si el destacamento tiene una solicitud pendiente.
        const result = await hasPendingRequest(paymentsState.params.destacamento_id);
        
        if (result === "Pending") {

          // Si hay solicitud pendiente, bloqueamos la creación de una nueva
          dispatch({type: "updateParams", payload: {name: "destacamento_id", value: "" }})
          toast.error('Este destacamento tiene una solicitud pendiente, para crear una nueva solicitud debe resolver la primera.');
        } 
        // El destacamento no tiene solicitudes pendientes, puede continuar.
        else {

          // cargamos los pagos del destacamento
          const { payments } = await getAllPayments(paymentsState.params);

          // Guardamos oficiales y meses pagados
          dispatch({ type: "setPaidData", payload: { data: payments } }); //podria crear un dispatch unico para estos tres

          // Inicializamos datos base del formulario
          dispatch({type: "updateDataPost", payload: { item: "responsable_id", value: state.user_info.id },});
          dispatch({type: "updateDataPost",payload: { item: "destacamento_id", value: paymentsState.params.destacamento_id}});
          dispatch({type: "updateDataPost",payload: { item: "valor_cuota", value: "1" },});
        }
      }
    };
    
    checkAndFetch();

  }, [paymentsState.params]);

  useEffect(() => {

    // Una vez cargados los pagos, inicializamos el estado de los checkboxes por oficial.
    if (paymentsState.PaidData) {
      dispatch({ type: "setInputsOficiales" });
    }
  }, [paymentsState.PaidData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "updateDataPost",
      payload: { item: e.target.name, value: e.target.value },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        dispatch({
          type: "updateDataPost",
          payload: { item: e.target.name, value: base64Image },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({type: "toogleLoading", payload: {value: true}})

    const { monto, comprobante_imagen, tasa, referencia } = paymentsState.DataPost.solicitudes;

    // Validación básica:
    // - Al menos un oficial/mes seleccionado.
    // - Campos obligatorios completos.
    if (
      !Object.values(paymentsState.allInputs).some((val) => val === true) ||
      !monto ||
      !comprobante_imagen ||
      !tasa ||
      !referencia
    ) {
      toast.error("Todos los campos son obligatorios");
      dispatch({type: "toogleLoading", payload: {value: false}})
      return;
    }

    // Dispara validaciones de negocio (meses consecutivos, etc.)
    dispatch({type: "validation"})
  
    dispatch({type: "toogleLoading", payload: {value: false}})
  };

  return (
    <>
      <div className="row d-flex g-3 my-2">
        <div className="col-lg-3 mb-3">
          <select
            className="form-select letra_muy_pequeña"
            value={paymentsState.params.destacamento_id}
            onChange={(e) =>
              dispatch({
                type: "updateParams",
                payload: { name: e.target.name, value: e.target.value },
              })
            }
            name="destacamento_id"
            id="destacamento_id"
          >
            <option value="">Selecciona un Destacamento</option>
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
            value={paymentsState.params.año}
            onChange={(e) =>
              dispatch({
                type: "updateParams",
                payload: { name: e.target.name, value: e.target.value },
              })
            }
            name="año"
            id="año"
          >
            {/* si el mes actual corresponde a los 3 primeros meses, mostramos el año anterior */}
            {[0, 1, 2].includes(new Date().getMonth()) && (
              <option key={currentYear - 1} value={currentYear - 1}>
                {currentYear - 1}
              </option>
            )}
            <option key={currentYear} value={currentYear}>
              {currentYear}
            </option>
          </select>
        </div>
        {paymentsState.params.destacamento_id && (
          <div className="col-md-4 col-lg-5">

            {/* 
              Selecciona todos los oficiales y todos los meses.
              Este checkbox sincroniza InputsOficiales + InputsMonths desde el reducer.
            */}
            <input
              className="me-2"
              id="select-all"
              type="checkbox"
              checked={paymentsState.selectAll}
              onChange={(e) =>
                dispatch({
                  type: "toogleAllInputs",
                  payload: { value: e.target.checked },
                })
              }
            />
            <label htmlFor="select-all">
              Seleccionar todos los oficiales y todos los meses
            </label>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center">{GrowExample()}</div>
      ) : paymentsState.PaidData.length ? (
        <>
          <div
            className="table-responsive overflow-y-scroll"
            style={{ maxHeight: "400px" }}
          >
            <Table bordered hover className="table-sticky border-top-1">
              <thead className="table-light ">
                <tr className="letra_muy_pequeña text-center">
                  <th className="style-th-n">
                    n°
                  </th>
                  <th className="style-th-oficial">
                    Oficial
                  </th>
                    {monthsAbrev.map((month, index) => (
                        <th key={index}>
                          <input
                            checked={paymentsState.InputsMonths[index + 1] || false}
                            type="checkbox"
                            onChange={(e) =>
                              dispatch({
                                type: "toogleInputsMonth",
                                payload: { month: index + 1, value: e.target.checked },
                              })
                            }
                          />{" "}
                        {month.nombre}
                      </th>
                      )
                    )}
                </tr>
              </thead>
              <tbody className="letra_muy_pequeña">
                {paymentsState.PaidData.map((oficial, index) => (
                  <tr key={oficial.oficial_id}>
                    <td className="style-td-n">
                      {index + 1}
                    </td>
                    <td className="style-td-oficial">
                      <input checked={ paymentsState.InputsOficiales[oficial.oficial_id] || false}
                        type="checkbox"
                        onChange={(e) =>
                          dispatch({
                            type: "toogleInputsOficiales",
                            payload: {
                              id: oficial.oficial_id,
                              value: e.target.checked}})}
                      />
                      {oficial.nombre}
                    </td>

                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <td key={month} className="month text-center">
                          <Input
                            months={oficial.meses_pagados}
                            month={month}
                            id={oficial.oficial_id}
                            paymentsState={paymentsState}
                            dispatch={dispatch}
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
                  name="comprobante_imagen"
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
                value={paymentsState?.DataPost?.solicitudes?.monto || ""}
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
                value={paymentsState?.DataPost?.solicitudes?.tasa || ""}
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
                value={paymentsState?.DataPost?.solicitudes?.referencia || ""}
                name="referencia"
                className="form-control form-control-sm w-50"
                type="text"
                placeholder="Ej. 1234"
                maxLength={4}
              />
            </div>

            <div className="col-md-2 d-flex justify-content-center">
              <input
                required
                className="btn btn-primary letra_muy_pequeña"
                type="submit"
                value={paymentsState.isLoading ? 'Cargando..' : 'Enviar Solicitud'}
              />
            </div>
          </form>
          <SummaryModal paymentsState={paymentsState} dispatch={dispatch} />
        </>
      ) : (
        <div className="text-center">
          Escoge un destacamento para iniciar la solicitud
        </div>
      )}
    </>
  );
}
