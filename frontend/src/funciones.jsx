import Swal from 'sweetalert2'
import { jwtDecode } from "jwt-decode";

export function capitalize(str) {
  if (!str || str.charAt(0) === str.charAt(0).toUpperCase()) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const findRama = (tipo, data) => {
  if (!data || !data.count_by_ramas) {
    return 0; // o un valor predeterminado como 0
  }
  const ramas = data.count_by_ramas;

  for (let i = 0; i < ramas.length; i++) {
    if (ramas[i].rama == tipo) {
      return ramas[i].total;
    }
  }

  return 0;
};

export function errorGeneralQuery(){
  return Swal.fire({
    title: "Error inesperado",
    text: "No se pudo conectar con el servidor. Por favor, intenta más tarde.",
    icon: "error",
    confirmButtonText: "Ok",
  });
}

export function errorSpecificQuery(mensaje){
  return Swal.fire({
    title: "Error",
    text: mensaje,
    icon: "error",
    confirmButtonText: "Ok",
  });
}

export function exitSpecificQuery(mensaje){
  Swal.fire({
    title: "Exito",
    text: mensaje,
    icon: "success",
    confirmButtonText: "Ok",
  });
}

export const find_names_by_ids = (key, value, obj) => {
  if (key == "destacamento_id") {
    const result = obj.find((dest) => dest.id == value);
    return result ? result.nombre : null;
  } else if (key == "rol") {
    return value == 1 ? "Administrador" : "Usuario";
  }
};

export const getUserSession = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
 
  try {
    const destacamento = jwtDecode(token);
    return destacamento.data;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
export async function getDestacamentos() {
  try {
    const result = await fetch(`${api}backend/destacamentos`);

    if (result.ok) {
      const respuesta = await result.json();
      return respuesta;
    }else{
      const respuesta = await result.json();
      const mensaje= respuesta.error || "Error al procesar la solicitud.";
      errorSpecificQuery(mensaje)
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud", error);
    console.log(error);
    errorGeneralQuery();
  }
}

export async function getAscensos() {
  try {
    const result = await fetch(`${api}backend/ascensos`);
    if (result.ok) {
      const respuesta = await result.json();
      return respuesta;
    }else{
      const respuesta = await result.json();
      const mensaje= respuesta.error || "Error al procesar la solicitud.";
      errorSpecificQuery(mensaje)
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud", error);
    console.log(error);
    errorGeneralQuery();
  }
}

export const api= import.meta.env.VITE_API_URL;

