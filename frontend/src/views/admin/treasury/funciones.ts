import { DataPostType, InputsTrueTemporaryType, oficMonthsList, PaidDataType, ParamsType, SummaryMonthsType } from "./reducer/types";

export function formatDate(date: string): string {
  if (typeof date !== "string") return "";

  const splitedDate = date.split("-");
  const year = splitedDate[0];
  const month = splitedDate[1];
  const day = splitedDate[2];

  return `${day}-${month}-${year}`;
}

export const MapPaidMonths = (months: [], month: number): string => {
  if (!Array.isArray(months) || months.length === 0) {
    return "";
  }
  const monthRequired = months.find((item) => item.mes === month);
  return monthRequired ? formatDate(monthRequired.fecha_pago) : "";
};

export const MapPaidMonthsRequest = (
  months: string[],
  month: number,
): boolean => {
  if (months.length > 0) {
    const monthRequired = months.find((item) => item.mes === month);
    if (monthRequired) {
      return true;
    }
  }
  return false;
};

export const evaluateStatus = (months: []) => {
  if (months.length === 0) return "Insolvente";

  const currentMonth = new Date().getMonth() + 1;
  const paidCurrentMonth = months.find((item) => item.mes === currentMonth);
  return paidCurrentMonth ? "Solvente" : "Insolvente";
};

export function formatearFechaHora(fechaHoraStr: string): string {
  // Convertimos a formato ISO para que el constructor lo entienda bien
  const fechaISO = fechaHoraStr.replace(" ", "T");

  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return "Formato inválido";

  const opcionesFecha: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const opcionesHora: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const fechaFormateada = new Intl.DateTimeFormat(
    "es-ES",
    opcionesFecha
  ).format(fecha);
  const horaFormateada = new Intl.DateTimeFormat("es-ES", opcionesHora).format(
    fecha
  );

  return `${fechaFormateada} ${horaFormateada}`;
}

export const months = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};

export const monthsArray = [
  { id: "01", nombre: "Enero" },
  { id: "02", nombre: "Febrero" },
  { id: "03", nombre: "Marzo" },
  { id: "04", nombre: "Abril" },
  { id: "05", nombre: "Mayo" },
  { id: "06", nombre: "Junio" },
  { id: "07", nombre: "Julio" },
  { id: "08", nombre: "Agosto" },
  { id: "09", nombre: "Septiembre" },
  { id: "10", nombre: "Octubre" },
  { id: "11", nombre: "Noviembre" },
  { id: "12", nombre: "Diciembre" },
];

export const status = [
  { id: "approved", value: "Aprobada" },
  { id: "rejected", value: "Rechazada" },
  { id: "pending", value: "Pendiente" },
];

export const showDetailMonths = (months: string[]): string[] => {
  const transformedArray = months.map((month) => {
    const splited = month.split("-");
    return `${splited[1]}-${splited[0]}`;
  });

  return transformedArray.sort();
};

export const monthsAbrev = [
  { id: "01", nombre: "Ene" },
  { id: "02", nombre: "Feb" },
  { id: "03", nombre: "Mar" },
  { id: "04", nombre: "Abr" },
  { id: "05", nombre: "May" },
  { id: "06", nombre: "Jun" },
  { id: "07", nombre: "Jul" },
  { id: "08", nombre: "Ago" },
  { id: "09", nombre: "Sep" },
  { id: "10", nombre: "Oct" },
  { id: "11", nombre: "Nov" },
  { id: "12", nombre: "Dic" },
];

export const monthsTotalToPay= (Obj: DataPostType['solicitudes']['relaciones_oficiales_meses']) =>{
   let total= 0
   for(let oficial in Obj ){
    total+= Obj[oficial].length
   }
   return total
}

export const monthsTotalToPayList= (Obj: oficMonthsList[]) =>{
  const counter= Obj.reduce((acum, item) => acum + (item.meses.length) ,0)
  return counter;
}



export const SelectedConsecutiveMonths = (Inputs: InputsTrueTemporaryType, data: PaidDataType[]) => {
  let idsErrors: string[]= []
  for (const [key, value] of Object.entries(Inputs)) {
    const orderArray = [...value].sort((a, b) => a - b);

    // Comenzar desde el segundo elemento (índice 1)
    for (let i = 1; i < orderArray.length; i++) {
      if (orderArray[i] - orderArray[i - 1] !== 1) {
        idsErrors= [...idsErrors, key]
      }
    }
    //si es 1, los meses a pagar comienzan desde enero, no hace falta verificar si tiene meses pagados
    if (orderArray[0] !== 1) {
      //busco el array de meses pagados de ese oficial
      const paidMonthList = data.find((of) => of.oficial_id === key);
      if (paidMonthList.meses_pagados.length) {
        for (let i = 1; i < orderArray[0]; i++) {
          if (!paidMonthList.meses_pagados.some((month) => month.mes === i)) {
            idsErrors= [...idsErrors, key]
          }
        }
      } else {
        //si viene vacio y no comienza desde enero, entonces hay meses vacios
        idsErrors= [...idsErrors, key]
      }
    }
  }
  return idsErrors;
};

export const FormatedDatePost = (ValidatedInputs: InputsTrueTemporaryType, año: ParamsType['año']) => {
  const nuevos_oficiales = Object.keys(ValidatedInputs);
  const nuevas_relaciones = {};

  for (const [key, value] of Object.entries(ValidatedInputs)) {
    nuevas_relaciones[key] = value.map(
      (month) => `${año}-${month.toString().padStart(2, "0")}-01`
    );
  }
  return {oficiales: nuevos_oficiales, meses: nuevas_relaciones}

};

export const evaluation = (oficiales_meses : oficMonthsList[]) =>{
   const group= oficiales_meses.map((item) => {
        const monthsJoined: SummaryMonthsType["meses"] =
          item.meses.map((month: string) => {
              return monthsAbrev.find((m) => m.id === month.split("-")[1])
                ?.nombre;
            }
          );
        return { nombre_apellido: `${item.nombres} ${item.apellidos}`, meses: monthsJoined };
     });
     return group
}
  


