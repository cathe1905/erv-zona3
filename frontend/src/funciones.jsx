import Spinner from 'react-bootstrap/Spinner';
import Swal from 'sweetalert2'

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

export function GrowExample() {
  return <Spinner animation="grow" />;
}

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

export default GrowExample;


