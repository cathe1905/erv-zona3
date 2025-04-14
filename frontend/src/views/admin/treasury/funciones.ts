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

export const evaluateStatus = (months: []) => {
  if (months.length === 0) return "Insolvente";

  const currentMonth = new Date().getMonth() + 1;
  const paidCurrentMonth = months.find((item) => item.mes === currentMonth);
  return paidCurrentMonth ? "Solvente" : "Insolvente";
};

export function formatearFechaHora(fechaHoraStr: string): string {
  // Convertimos a formato ISO para que el constructor lo entienda bien
  const fechaISO = fechaHoraStr.replace(' ', 'T');

  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return 'Formato inválido';

  const opcionesFecha: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const opcionesHora: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const fechaFormateada = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(fecha);
  const horaFormateada = new Intl.DateTimeFormat('es-ES', opcionesHora).format(fecha);

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
  { id: '01', nombre: 'Enero' },
  { id: '02', nombre: 'Febrero' },
  { id: '03', nombre: 'Marzo' },
  { id: '04', nombre: 'Abril' },
  { id: '05', nombre: 'Mayo' },
  { id: '06', nombre: 'Junio' },
  { id: '07', nombre: 'Julio' },
  { id: '08', nombre: 'Agosto' },
  { id: '09', nombre: 'Septiembre' },
  { id: '10', nombre: 'Octubre' },
  { id: '11', nombre: 'Noviembre' },
  { id: '12', nombre: 'Diciembre' }
];

export const status = [
  {id: "approved", value: "Aprobada"},
  {id: "rejected", value: "Rechazada"},
  {id: "pending", value: "Pendiente"}
]

export const showDetailMonths = (months : string[]) : string[] =>{
  const transformedArray= months.map(month => {
    const splited= month.split('-');
    return `${splited[1]}-${splited[0]}`
  })

  return transformedArray.sort()
}
