import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserSession } from "./LayoutDest";
import { errorSpecificQuery, errorGeneralQuery } from "../../funciones";
import { findRama } from "../../funciones";
import Number from "../../components/Animation";

const Dashboard_dest = () => {
  const [param, setParam] = useSearchParams();
  const [data, setData] = useState(null);
  const destacamento = param.get("destacamento") || "";
  const [user, setUser]= useState(null)
  const hasUpdatedParam = useRef(false);

  useEffect(() =>{
    const evaluateUser= async () =>{
        const user= await getUserSession();
        if(user){
           setUser(user);
        }
    }
    evaluateUser();
  }, [])

  const getStadisticas = async () => {
    if (!user) {
      console.error("Token ausente o erróneo");
      return;
    }
    if(user){
      try {
        const respuesta = await fetch(
          `http://erv-zona3/backend/?destacamento=${user.destacamento}`
         
        );
        if (respuesta.ok) {
          const estadisticas = await respuesta.json();
          setData(estadisticas);
        }else{
          const result = await respuesta.json();
          const mensaje= result.error || "Error al procesar la solicitud.";
          errorSpecificQuery(mensaje)
        }
      } catch (error) {
        console.error("Hubo un problema con la solicitud", error);
        errorGeneralQuery();
        return;
      }
    }
   
  };

  useEffect(() => {
    if (user && user.destacamento){
      if (user.destacamento.trim() !== destacamento.trim()) {
        errorSpecificQuery("No tienes acceso a otro destacamento!")
        setParam({ destacamento: user.destacamento });
        hasUpdatedParam.current = true;
      } else {
        getStadisticas();
      }
    }

  }, [user, destacamento]);

  const prejuniors = parseInt(findRama('pre-junior', data), 10);
  const pioneros = parseInt(findRama('pionero', data), 10);
  const brijers = parseInt(findRama('brijer', data), 10);
  const oficiales = parseInt(findRama('oficial', data), 10);
  const general = data ? parseInt(data.general_count, 10) : 0;

  return (
    <main>
      <div className="roboto-medium row container-fluid d-flex justify-content-center bg-white rounded-2 px-md-0 pt-md-4 pb-md-5 ms-1 ms-md-0 mt-3 mt-md-0">
        <aside className="row fondo-azul col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-4 d-flex justify-content-center align-items-center   ">
            <i className="bi bi-person-lines-fill fs-1 dis text-white rounded-circle px-3 py-2 fondo-azul-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-dark">
            <p className="col-12 m-1 ">Estadística general</p>
            <Number n={general}/>
          </div>
        </aside>

        <aside className="row borde-morado col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-3 d-flex justify-content-center align-items-center  rounded-start">
            <i className="bi bi-reddit fs-1 text-white rounded-circle px-3 py-2 fondo-morado-claro"></i>
          </div>

          <div className="col-9 row d-flex flex-column align-items-center p-3 pe-2 text-dark">
            <p className="col-12 m-1 ">Pre-juniors y Pre-joyas</p>
            <Number n={prejuniors}/>
          </div>
        </aside>

        <aside className="row fondo-verde col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
            <i className="bi bi-star fs-1 text-white rounded-circle px-3 py-2 color-verde-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-dark">
            <p className="col-12 m-1 ">Junior y Joyas</p>
            <Number n={pioneros}/>
          </div>
        </aside>

        <aside className="row fondo-rojo col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-4 d-flex justify-content-center align-items-center rounded-start">
            <i className="bi bi-person-badge fs-1 text-white rounded-circle px-3 py-2 fondo-rojo-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-dark">
            <p className="col-12 m-1 ">Brijers</p>
            <Number n={brijers}/>
          </div>
        </aside>

        <aside className="row fondo-naranja col-12 col-md-4 rounded mx-2 my-3 ancho">
          <div className="col-4 d-flex justify-content-center align-items-center  rounded-start">
            <i className="bi bi-shield-fill fs-1 text-white rounded-circle px-3 py-2 fondo-naranja-claro"></i>
          </div>
          <div className="col-8 row d-flex flex-column align-items-center p-3 text-dark">
            <p className="col-12 m-1 ">Oficiales</p>
            <Number n={oficiales}/>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Dashboard_dest;
