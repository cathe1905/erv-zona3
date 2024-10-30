import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {

    return(
        <main className="roboto-medium ">
        <aside className="row fondo-azul  m-3 rounded">
          <div className="col-4 d-flex justify-content-center align-items-center   ">
            <i class="bi bi-person-lines-fill display-1 text-white rounded-circle px-3 py-2 fondo-azul-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-white">
            <p className="col-12 m-1 ">Estadística general</p>
            <p className="col-12 m-1 fs-4 ">1538</p>
          </div>
        </aside>

        <aside className="row fondo-morado m-3 rounded">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
          <i class="bi bi-reddit display-1 text-white rounded-circle px-3 py-2 fondo-morado-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3  text-white">
            <p className="col-12 m-1 ">Pre-juniors y Pre-joyas</p>
            <p className="col-12 m-1 fs-4 ">34</p>
          </div>
        </aside>

        <aside className="row fondo-verde m-3 rounded">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
          <i class="bi bi-star display-1 text-white rounded-circle px-3 py-2 color-verde-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-white">
            <p className="col-12 m-1 ">Junior y Joyas</p>
            <p className="col-12 m-1 fs-4 color-verde">300</p>
          </div>
        </aside>

        <aside className="row fondo-rojo  m-3 rounded">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
          <i class="bi bi-person-badge display-1 text-white rounded-circle px-3 py-2 fondo-rojo-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-white">
            <p className="col-12 m-1 ">Brijers</p>
            <p className="col-12 m-1 fs-4 ">600</p>
          </div>
        </aside>

        <aside className="row fondo-naranja m-3 rounded">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
          <i class="bi bi-shield-fill display-1 text-white rounded-circle px-3 py-2 fondo-naranja-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-white">
            <p className="col-12 m-1 ">Oficiales</p>
            <p className="col-12 m-1 fs-4 ">200</p>
          </div>
        </aside>

        <aside className="row fondo-azul m-3 rounded">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
          <i class="bi bi-diagram-3 display-1 text-white rounded-circle px-3 py-2 fondo-azul-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-white">
            <p className="col-12 m-1 ">Directiva Zonal</p>
            <p className="col-12 m-1 fs-4 ">6</p>
          </div>
        </aside>
       
      </main>

    )

}

export default Dashboard;

