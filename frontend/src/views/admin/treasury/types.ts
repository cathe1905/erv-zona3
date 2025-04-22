export type DataPostType = {
    solicitudes: {
      responsable_id: string;
      destacamento_id: string;
      comprobante_imagen: string;
      oficiales_ids: {
        oficiales: string[]; 
      };
      relaciones_oficiales_meses: Record<string, string>; 
      monto: string;
      valor_cuota: string;
      tasa: string;
      referencia: string;
    };
  };

  type MesPagado = {
    año: number;
    fecha_pago: string;
    mes: number;
    monto: number;
    responsable: string;
    responsable_id: number;
    solicitud_id: number;
  };
  
  export type OficialConPagos = {
    oficial_id: string;
    nombre: string;
    destacamento_id: string;
    destacamento_nombre: string;
    meses_pagados: MesPagado[];
  };
  
  