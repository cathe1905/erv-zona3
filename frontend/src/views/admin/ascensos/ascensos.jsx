export const getAscensos = async () => {
    try {
      const result = await fetch("http://erv-zona3/backend/ascensos");
  
      if (result.ok) {
        const respuesta = await result.json();
        return respuesta;
      }
    } catch (error) {
      console.error("Hubo un problema con la solicitud", error);
      console.log(error);
      return;
    }
  };
const Ascensos =() =>{
    return (
        <div>Aqui va el listado de ascensos</div>
    )
}

export default Ascensos