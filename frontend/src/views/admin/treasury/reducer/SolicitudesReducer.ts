// Reducer central para la creación de solicitudes de pago.
// Aquí se concentra:
// - Manejo de selección de oficiales y meses
// - Validaciones de negocio (meses consecutivos)
// - Preparación del payload final (DataPost)
// - Estado del modal de resumen

import {
  FormatedDatePost,
  monthsAbrev,
  monthsTotalToPay,
  SelectedConsecutiveMonths,
} from "../funciones";
import {
  DataPostType,
  Inputs,
  PaidDataType,
  InputKey,
  SummaryMonthsType,
  InputsTrueTemporaryType,
  ParamsType, initialStateDataPost
} from "./types";

export type RequestActions =
  | { type: "setPaidData"; payload: { data: PaidDataType[] } }
  | { type: "setInput"; payload: { input: Inputs } }
  | { type: "updateParams" ; payload: { name: string; value: string }  }
  | { type: "toogleInput"; payload: { input: InputKey; value: boolean } }
  | { type: "toogleAllInputs"; payload: { value: boolean } }
  | { type: "setInputsOficiales" }
  | { type: "setMonthsToPay"; payload: { total: number } }
  | {type: "updateDataPost"; payload: { item: string; value: DataPostType['solicitudes'][keyof DataPostType['solicitudes']]; }}
  | { type: "setSummaryMonths"}
  | { type: "openModal" }
  | { type: "goBack" }
  | { type: "hideModal" }
  | { type: "toogleLoading"; payload: { value: boolean } }
  | { type: "resetAll" }
  | { type: "resetErrors" }
  | { type: "validation" }
  | { type: "setTotalMonthsToPay" }
  | { type: "toogleInputsMonth"; payload: { month: number; value: boolean } } //inputs superiores horizontales (todos los meses)
  | {type: "toogleInputsOficiales"; payload: { id: PaidDataType["oficial_id"]; value: boolean }}; // inputs verticales laterales (todos los oficiales)

export type RequestStateTypes = {
  params: ParamsType
  PaidData: PaidDataType[];
  DataPost: DataPostType;
  show: boolean;
  allInputs: Inputs;
  InputsMonths: Inputs; //inputs superiores horizontales (todos los meses)
  InputsOficiales: Inputs; // inputs verticales laterales (todos los oficiales)
  totalMonthstoPay: number;
  summaryMonths: SummaryMonthsType[];
  errors: string[];
  isLoading: boolean
  selectAll: boolean
};

export const RequestState = {
  params: {
    año: new Date().getFullYear().toString(),
    destacamento_id: "",
  },
  PaidData: [],
  DataPost: initialStateDataPost,
  show: false,
  allInputs: {} as Inputs,
  InputsMonths: Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, false])
  ),
  InputsOficiales: {} as Inputs,
  totalMonthstoPay: 0,
  summaryMonths: [],
  errors: [],
  isLoading: false,
  selectAll: false
};

export const paymentsRequestReducer = (
  state: RequestStateTypes = RequestState,
  action: RequestActions
) => {

  if (action.type === "setPaidData") {
    return {
      ...state,
      PaidData: action.payload.data,
    };
  }

  if (action.type === "setInput") {
    return {
      ...state,
      allInputs: { ...state.allInputs, ...action.payload.input },
    };
  }

  if (action.type === "updateParams") {
    return {
      ...state,
      params: { ...state.params, [action.payload.name]: action.payload.value,},
    };
  }

  if (action.type === "toogleInput") {
    return {
      ...state,
      allInputs: {
        ...state.allInputs,
        [action.payload.input]: action.payload.value,
      },
    };
  }

  if (action.type === "setInputsOficiales") {

    // Inicializa los checkboxes laterales (oficiales)
    // Se ejecuta solo después de cargar PaidData
    // Cada oficial parte desmarcado (false)
    const initialOficialIdState = Object.fromEntries(
      state.PaidData.map((item) => [item.oficial_id, false])
    );
    return {
      ...state,
      InputsOficiales: initialOficialIdState,
    };
  }

  if (action.type === "setMonthsToPay") {

    // Calcula el total de meses a pagar en base a la relación oficial-mes ya validada.
    const total = monthsTotalToPay(
      state.DataPost.solicitudes.relaciones_oficiales_meses
    );
    return {
      ...state,
      totalMonthstoPay: total,
    };
  }
  if (action.type === "updateDataPost") {
    return {
      ...state,
      DataPost: {
        ...state.DataPost,
        solicitudes: {
          ...state.DataPost.solicitudes,
          [action.payload.item]: action.payload.value,
        },
      },
    };
  }

  if (action.type === "openModal") {
    return {
      ...state,
      show: true,
    };
  }

  if (action.type === "hideModal") {
    return {
      ...state,
      show: false,
      summaryMonths: []
    };
  }
  if (action.type === "toogleLoading") {
    return {
      ...state,
      isLoading: action.payload.value
    };
  }

  if (action.type === "setSummaryMonths") {

    // Construye el resumen que se muestra en el modal:
    // - Recorre los oficiales seleccionados
    // - Traduce los meses seleccionados a nombres abreviados
    // - Une oficial + meses legibles para el usuario
    const evaluation =
      state.DataPost?.solicitudes?.oficiales_ids?.oficiales?.map((item) => {

        // Obtiene la información completa del oficial.
        const oficial = state.PaidData.find(
          (oficial) => oficial.oficial_id === item
        );
        // Convierte los meses (YYYY-MM) a nombres abreviados
        const monthsJoined: SummaryMonthsType["meses"] =
          state.DataPost.solicitudes.relaciones_oficiales_meses[item].map(
            (month: string) => {
              return monthsAbrev.find((m) => m.id === month.split("-")[1])
                ?.nombre;
            }
          );
        return { nombre_apellido: oficial?.nombre, meses: monthsJoined };
      });
    return {
      ...state,
      summaryMonths: evaluation,
    };
  }

  if (action.type === "resetAll") {

    // Reinicia el flujo completo de creación de solicitud
    // NOTA: PaidData se vuelve a cargar desde el fetch,
    // los meses pagados deben mantenerse visibles solo mientras se edita
    return {
      ...state,
      DataPost: {} as DataPostType,
      PaidData: [],
      show: false,
      allInputs: {} as Inputs,
      InputsMonths: Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [i + 1, false])
      ),
      InputsOficiales: {} as Inputs,
      totalMonthstoPay: 0,
      summaryMonths: [],
      errors: [],
      isLoading: false,
      selectAll: false,
      
    };
  }

  if (action.type === "resetErrors") {
    return {
      ...state,
      errors: [],
    };
  }

  if (action.type === "toogleAllInputs") {

    // Activa o desactiva TODOS los inputs individuales (oficial-mes)
    // Se basa únicamente en allInputs
    const newInputs = Object.fromEntries(
      Object.entries(state.allInputs).map(([key]) => [
        key,
        action.payload.value,
      ])
    );

    // Reinicia checkboxes laterales de oficiales
    const initialOficialIdState = Object.fromEntries(
      state.PaidData.map((item) => [item.oficial_id, false])
    );
    return {
      ...state,
      allInputs: newInputs,
      InputsMonths: Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [i + 1, false])
      ),
      InputsOficiales: initialOficialIdState,
      selectAll: action.payload.value
    };
  }

  if (action.type === "toogleInputsMonth") {

    // Marca o desmarca todos los oficiales para un mes específico
    // La key de allInputs viene como: "oficialId-mes"
    const entries = Object.entries(state.allInputs).map(([key, value]) => {
      const keyMonth = key.split('-')[1]; 
      if (keyMonth === String(action.payload.month)) {
        return [key, action.payload.value];
      } else {
        return [key, value];
      }
    });

    return {
      ...state,
      allInputs: Object.fromEntries(entries),
      InputsMonths: {
        ...state.InputsMonths,
        [action.payload.month]: action.payload.value,
      },
    };
  }

  if (action.type === "toogleInputsOficiales") {

    // Marca o desmarca todos los meses de un oficial específico
    // La key de allInputs viene como: "oficialId-mes"
    const entries = Object.entries(state.allInputs).map(([key, value]) => {
      const keyOfic = key.split('-')[0]; 
      if ( keyOfic === String(action.payload.id)) {
        return [key, action.payload.value];
      } else {
        return [key, value];
      }
    });

    return {
      ...state,
      allInputs: Object.fromEntries(entries),
      InputsOficiales: {
        ...state.InputsOficiales,
        [action.payload.id]: action.payload.value,
      },
    };
  }

  if (action.type === "validation") {

    // Extrae todos los inputs activos (true)
    // y los agrupa por oficial:
    // { oficialId: [mes1, mes2, mes3] }
    const trueInputs: InputsTrueTemporaryType = {};
    for (const [key, value] of Object.entries(state.allInputs)) {
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

    // Valida que los meses seleccionados sean consecutivos
    // Retorna IDs de oficiales con errores
    const errors = SelectedConsecutiveMonths(trueInputs, state.PaidData); 

    if (errors.length) {
      return {
        ...state,
        errors,
      };
    }

    // Formatea los datos finales para el backend (YYYY-MM)
    const DatesAndIds= FormatedDatePost(trueInputs, state.params.año);

    return {
      ...state,
      DataPost: {
        ...state.DataPost,
        solicitudes: {
          ...state.DataPost.solicitudes,
          oficiales_ids: {
            oficiales: DatesAndIds.oficiales 
          },
          relaciones_oficiales_meses: DatesAndIds.meses
        },
      },

    };
  }

  if (action.type === "setTotalMonthsToPay") {
    
    // Calcula el total final de meses a pagar luego de la validación
    return {
      ...state,
      totalMonthstoPay: monthsTotalToPay(state?.DataPost?.solicitudes?.relaciones_oficiales_meses)
    };
  }

  if(action.type === "goBack"){
    return{
      ...state,
      summaryMonths: []
    }
  }

  return state;
};
