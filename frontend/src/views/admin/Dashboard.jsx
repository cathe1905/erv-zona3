

const getStadisticas = async () =>{

  try{
    const respuesta= await fetch('http://erv-zona3/backend/');
    if(respuesta.ok){
      return respuesta.json();
    }
   
  }catch(error){
    console.error('Hubo un problema con la solicitud', error)
    console.log(error)
    return;
  }
}
const estadisticas= await getStadisticas();

const Dashboard = () => {
    return(
        <main >
        
         <div className="roboto-medium row container-fluid d-flex justify-content-center bg-white  rounded-2 px-md-0 pt-md-4 pb-md-5 ms-1 ms-md-0 mt-3 mt-md-0">
         
        <aside className="row fondo-azul col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-4 d-flex justify-content-center align-items-center   ">
            <i className="bi bi-person-lines-fill fs-1 dis text-white rounded-circle px-3 py-2 fondo-azul-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-dark">
            <p className="col-12 m-1 ">Estadística general</p>
            <p className="col-12 m-1 fs-4">{estadisticas.general_count}</p>
          </div>
        </aside>

        <aside className="row borde-morado col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-3 d-flex justify-content-center align-items-center  rounded-start">
          <i className="bi bi-reddit fs-1 text-white rounded-circle px-3 py-2 fondo-morado-claro"></i>
          </div>
          <div className="col-9 row d-flex flex-column align-items-center p-3 pe-2 text-dark">
            <p className="col-12 m-1 ">Pre-juniors y Pre-joyas</p>
            <p className="col-12 m-1 fs-4 ">{estadisticas.count_by_ramas[3].total}</p>
          </div>
        </aside>

        <aside className="row fondo-verde col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
          <i className="bi bi-star fs-1 text-white rounded-circle px-3 py-2 color-verde-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-dark">
            <p className="col-12 m-1 ">Junior y Joyas</p>
            <p className="col-12 m-1 fs-4 color-verde">{estadisticas.count_by_ramas[2].total}</p>
          </div>
        </aside>

        <aside className="row fondo-rojo col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-4 d-flex justify-content-center align-items-center rounded-start">
          <i className="bi bi-person-badge fs-1 text-white rounded-circle px-3 py-2 fondo-rojo-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-dark">
            <p className="col-12 m-1 ">Brijers</p>
            <p className="col-12 m-1 fs-4 ">{estadisticas.count_by_ramas[0].total}</p>
          </div>
        </aside>

        <aside className="row fondo-naranja col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
          <i className="bi bi-shield-fill fs-1 text-white rounded-circle px-3 py-2 fondo-naranja-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-dark">
            <p className="col-12 m-1 ">Oficiales</p>
            <p className="col-12 m-1 fs-4 ">{estadisticas.count_by_ramas[1].total}</p>
          </div>
        </aside>

        <aside className="row fondo-azul col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
          <i className="bi bi-diagram-3 fs-1 text-white rounded-circle px-3 py-2 fondo-azul-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-dark">
            <p className="col-12 m-1 ">Directiva Zonal</p>
            <p className="col-12 m-1 fs-4 ">{estadisticas.zonal_count}</p>
          </div>
        </aside>
        </div> 
       
      </main>

    )

}

export default Dashboard;

