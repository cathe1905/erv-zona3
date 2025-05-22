export type Inputs ={
    [key: string]: boolean;
}

export type InputKey = keyof Inputs;

export type ParamsType={
  año: string
  destacamento_id: string
}

export type DataPostType = {
    solicitudes: {
      id?: string;
      responsable_id: string;
      destacamento_id: string;
      comprobante_imagen: string;
      oficiales_ids: {
        oficiales: string[]; 
      };
      relaciones_oficiales_meses: meses_oficiales; 
      monto: string;
      valor_cuota: string;
      tasa: string;
      referencia: string;
      fecha_solicitud?: string
    };
};


  type meses_oficiales={
    [key: string]: string[];
  }

  export const initialStateDataPost: DataPostType = {
    solicitudes: {
      responsable_id: "",  
      destacamento_id: "", 
      comprobante_imagen: "",  
      oficiales_ids: {
        oficiales: [] 
      },
      relaciones_oficiales_meses: {},  
      monto: "",  
      valor_cuota: "", 
      tasa: "", 
      referencia: "", 
    }
  };
  

  export type InputsTrueTemporaryType={
    [key: string]: number[];
  }
  
  export type PaidDataType={
    oficial_id: string;
    nombre: string;
    destacamento_id: string;
    destacamento_nombre: string;
    meses_pagados: PagoMensual[];
  }

  type PagoMensual = {
    mes: number;
    año: number;
    fecha_pago: string; 
    monto: number;
    responsable: string;
    responsable_id: number;
    solicitud_id: number;
  };
export type SummaryMonthsType = {
  nombre_apellido: string
  meses: string[]
}

export type Pago = {
  mes: number;
  fecha_pago: string; 
  monto: number;
  responsable_id: number;
  solicitud_id: number;
  año: number;
  responsable: string;
};

export type oficMonthsList = {
  id: number
  nombres: string
  apellidos: string
  meses: string[]
}

  
 