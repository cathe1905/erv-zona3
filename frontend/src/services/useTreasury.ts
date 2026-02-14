import { useState } from "react";
import { api } from "../funciones";
import axios from "axios";
import { DataPostType } from "@/views/admin/treasury/reducer/types";

type getAllPaymentsType = {
  año: string;
  destacamento_id: string;
  nombre?: string;
  page?: string;
  limit?: string;
};

type getAllPaymentsRequestsType= Omit<getAllPaymentsType, 'nombre'> & {
  mes: string
  estatus: string
  id: string
}

type infoPaymentRequestType={
  id: string
  id_user: string
  comment?: string
}

const filterParams = (obj : getAllPaymentsType | getAllPaymentsRequestsType) =>{
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== "")
  );
}
export default function useTreasury() {

  const [isLoading, setLoading] = useState(false);

  const getAllPayments = async (params: getAllPaymentsType) => {
    try {
      setLoading(true);
      const filteredParams = filterParams(params)

      const queryString = new URLSearchParams(filteredParams).toString();

      const url = `${api}backend/pagos?${queryString}`;

      const data = await axios(url);

      if (!Array.isArray(data.data.payments)) {
        return data.data.error;
      }

      if (data.statusText === "OK") {
        return data.data;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAllPaymentsRequests = async (params: getAllPaymentsRequestsType) => {

    try {
      setLoading(true);

       const filteredParams = filterParams(params)

      const queryString = new URLSearchParams(filteredParams).toString();

      const url = `${api}backend/solicitud_pagos?${queryString}`;

      const data = await axios(url);

      if (!Array.isArray(data.data.solicitudes)) {
        return data.data.error;
      }
      
      if (data.statusText === "OK") {
        return data.data;
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getHistoryRequest = async (solicitud_id: string) => {

    try {
      setLoading(true);

      const url = `${api}backend/historial-solicitudes?solicitud_id=${solicitud_id}`;

      const data = await axios(url);

      if (!data.data.historial) {
        return data.data.error;
      }
      
      if (data.statusText === "OK") {
        return data.data.historial;
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentRequest = async (solicitud_id: string) => {
    try {
      setLoading(true);

      const url = `${api}backend/solicitud_pagos/eliminar`;

      const data = await axios.post(url, JSON.stringify(solicitud_id));
      
      if (data.statusText=== 'OK') {
        return true;
      }else{
        return false;
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const newPaymentRequest= async (request: DataPostType) =>{
    try {
      setLoading(true);

      const url = `${api}backend/solicitud_pagos`;

      const data = await axios.post(url, JSON.stringify(request));
      
      if (data.statusText=== "Created") {
        return true;
      }else{
        return false;
      }
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
   const rejectPaymentRequest= async (infoPaymentRequest: infoPaymentRequestType) =>{
    try {
      setLoading(true);

      const url = `${api}backend/rechazar-solicitud`;

      const data = await axios.post(url, infoPaymentRequest);

      if (data.statusText=== "Created") {
        return true;
      }else{
        return false;
      }
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
   }

   const approvedPaymentRequest= async (infoPaymentRequest: infoPaymentRequestType) =>{
      try {
        setLoading(true);

        const url = `${api}backend/aprobar-pagos`;
        const response = await axios.post(url, infoPaymentRequest);

        if (response.status === 201) { // 201 es el código para "Created"
          return true;
        } else {
          // Si el servidor devuelve un error estructurado
          return response.data?.message || 'Error desconocido';
        }
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    const hasPendingRequest = async (id: string) =>{
      try {
        setLoading(true);

        const url = `${api}backend/ultima-solicitud?id=${id}`;
        const response = await axios(url);

        if (response.status === 200) { 
          return response.data.mensaje;
        } else {
          return response.data?.message || 'Error desconocido';
        }
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    // Get
    const getRequestById = async (id: string)  =>{
      try {
        setLoading(true);

        const url = `${api}backend/solicitud_pagos/actualizar?id=${id}`;
        const response = await axios(url);
      
        if (response.status === 200) { 
          return response.data
        } else {
          return response.data?.message || 'Error desconocido';
        }
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    // Post
    const EditRequest = async (request: DataPostType) =>{
      try {
        setLoading(true);

        const url = `${api}backend/solicitud_pagos/actualizar`;
        const response = await axios.post(url, request);

      if (response.statusText=== "Created") {
        return true;
      }else{
        return false;
      }
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
   

  return {
    getAllPayments,
    getAllPaymentsRequests,
    getHistoryRequest,
    isLoading,
    newPaymentRequest,
    rejectPaymentRequest,
    approvedPaymentRequest,
    hasPendingRequest,
    getRequestById,
    EditRequest,
    deletePaymentRequest
  };
}
