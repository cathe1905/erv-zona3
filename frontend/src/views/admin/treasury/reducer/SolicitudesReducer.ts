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
  ParamsType,
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
};

export const RequestState = {
  params: {
    año: new Date().getFullYear().toString(),
    destacamento_id: "",
  },
  PaidData: [],
  DataPost: {} as DataPostType,
  show: false,
  allInputs: {} as Inputs,
  InputsMonths: Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, false])
  ),
  InputsOficiales: {} as Inputs,
  totalMonthstoPay: 0,
  summaryMonths: [],
  errors: [],
  isLoading: false
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
    //asegurarme que ya Datapaid exista para llamar esta accion
    const initialOficialIdState = Object.fromEntries(
      state.PaidData.map((item) => [item.oficial_id, false])
    );
    return {
      ...state,
      InputsOficiales: initialOficialIdState,
    };
  }
  if (action.type === "setMonthsToPay") {
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
    const evaluation =
      state.DataPost?.solicitudes?.oficiales_ids?.oficiales?.map((item) => {
        const oficial = state.PaidData.find(
          (oficial) => oficial.oficial_id === item
        );
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
    // en este estoy excluyendo PaidData porque los meses pagados deben mantenerse visibles asi termine el envio de solicitud
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
      isLoading: false
    };
  }
  if (action.type === "resetErrors") {
    return {
      ...state,
      errors: [],
    };
  }
  if (action.type === "toogleAllInputs") {
    const newInputs = Object.fromEntries(
      Object.entries(state.allInputs).map(([key]) => [
        key,
        action.payload.value,
      ])
    );
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
    };
  }
  if (action.type === "toogleInputsMonth") {
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
    //extrae los inputs con value true y los agrupa con el id correspondiente
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
    const errors = SelectedConsecutiveMonths(trueInputs, state.PaidData); //devuelve todos los ids de los oficiales con errores

    if (errors.length) {
      return {
        ...state,
        errors,
      };
    }
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
    return {
      ...state,
      totalMonthstoPay: monthsTotalToPay(state.DataPost.solicitudes.relaciones_oficiales_meses)
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
