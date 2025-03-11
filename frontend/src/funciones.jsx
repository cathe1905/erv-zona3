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

export const downloadExcel = async (url) => {

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al descargar el archivo");
    }

    // Convertir la respuesta a un blob
    const blob = await response.blob();

    // Crear un enlace para descargar el archivo
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "listado.xlsx"; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Liberar el objeto URL
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const calcularEdad = (fechaNacimiento) => {
  // Verificar que la fecha tenga el formato correcto
  if (!fechaNacimiento || typeof fechaNacimiento !== 'string' || fechaNacimiento.length !== 10) {
    console.error("Formato de fecha inválido. Debe ser YYYY-MM-DD.");
    return null;
  }

  // Dividir la cadena de fecha en año, mes y día
  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);

  // Validar que los valores sean números válidos
  if (isNaN(dia) || isNaN(mes) || isNaN(anio)) {
    console.error("La fecha de nacimiento contiene valores no numéricos.");
    return null;
  }

  // Crear un objeto Date con la fecha de nacimiento
  const fechaNac = new Date(anio, mes - 1, dia); // Los meses en Date son 0-indexados (0 = enero)

  // Validar que la fecha sea válida
  if (
    fechaNac.getFullYear() !== anio ||
    fechaNac.getMonth() + 1 !== mes ||
    fechaNac.getDate() !== dia
  ) {
    console.error("Fecha de nacimiento inválida.");
    return null;
  }

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Calcular la diferencia de años
  let edad = fechaActual.getFullYear() - fechaNac.getFullYear();

  // Ajustar la edad si el cumpleaños aún no ha ocurrido este año
  const mesActual = fechaActual.getMonth();
  const diaActual = fechaActual.getDate();

  if (
    mesActual < fechaNac.getMonth() ||
    (mesActual === fechaNac.getMonth() && diaActual < fechaNac.getDate())
  ) {
    edad--; // Restar 1 si el cumpleaños aún no ha pasado
  }

  return edad;
};

export const api= import.meta.env.VITE_API_URL;

