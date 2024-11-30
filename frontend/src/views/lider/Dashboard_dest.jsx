import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserSession } from "./LayoutDest";
import {
  errorSpecificQuery,
  errorGeneralQuery,
  capitalize,
} from "../../funciones";
import { findRama } from "../../funciones";
import Number from "../../components/Animation";
import BarChart from "../../components/BarChart";
import GrowExample from "../../funciones";

const Dashboard_dest = () => {
  const [param, setParam] = useSearchParams();
  const [data, setData] = useState(null);
  const destacamento = param.get("destacamento") || "";
  const [user, setUser] = useState(null);
  const hasUpdatedParam = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const evaluateUser = async () => {
      const user = await getUserSession();
      if (user) {
        setUser(user);
      }
    };
    evaluateUser();
  }, []);

  const getStadisticas = async () => {
    if (!user) {
      console.error("Token ausente o erróneo");
      return;
    }
    if (user) {
      try {
        const respuesta = await fetch(
          `http://erv-zona3/backend/?destacamento=${user.destacamento}`
        );
        if (respuesta.ok) {
          const estadisticas = await respuesta.json();
          setData(estadisticas); 
        } else {
          const result = await respuesta.json();
          const mensaje = result.error || "Error al procesar la solicitud.";
          errorSpecificQuery(mensaje);
        }
        setLoading(false);
      } catch (error) {
        console.error("Hubo un problema con la solicitud", error);
        errorGeneralQuery();
        setLoading(false);
        return;
      }
    }
  };

  useEffect(() => {
    if (user && user.destacamento) {
      if (user.destacamento.trim() !== destacamento.trim()) {
        errorSpecificQuery("No tienes acceso a otro destacamento!");
        setParam({ destacamento: user.destacamento });
        hasUpdatedParam.current = true;
      } else {
        getStadisticas();
      }
    }
  }, [user, destacamento]);

  const prejuniors = parseInt(findRama("pre-junior", data), 10);
  const pioneros = parseInt(findRama("pionero", data), 10);
  const brijers = parseInt(findRama("brijer", data), 10);
  const oficiales = parseInt(findRama("oficial", data), 10);
  const general = data ? parseInt(data.general_count, 10) : 0;

  const data_grafica = [prejuniors, pioneros, brijers, oficiales];

  const dataExplo = {
    labels: [
      "Pre-Juniors y Pre-Joyas",
      "Juniors y Joyas",
      "Brijers",
      "Oficiales",
    ],
    datasets: [
      {
        label: user ? capitalize(user.destacamento) : "",
        data: data_grafica,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <main>
      {loading ? (
        <div colSpan="11" className="text-center">
          {GrowExample()}
        </div>
      ) : (
        <>
          <div className="roboto-medium row container-fluid d-flex justify-content-center bg-white rounded-2 px-md-0 pt-md-4 pb-md-5 ms-1 ms-md-0 mt-3 mt-md-0">
          <aside className="row fondo-azul col-12 col-md-4 rounded mx-2 my-3 p-0 ancho ">
              <div className="col-8 row d-flex flex-column align-items-center text-dark text-white py-1 px-2">
                <Number n={general} />
                <p className="col-12 m-1">Estadística general</p>
              </div>
              <a
                href="/dashboard/dest/explo"
                className="text-decoration-none d-flex justify-content-center align-items-center text-white fondo-azul-info m-0 p-2 rounded-bottom-2 letra_muy_pequeña text-center"
              >
                <p className="mb-0 me-2">Mas información</p>
                <i class="bi bi-arrow-right-square"></i>
              </a>
            </aside>

            <aside className="row fondo_verde col-12 col-md-4 rounded mx-2 my-3 p-0 ancho ">
              <div className="col-8 row d-flex flex-column align-items-center text-dark text-white py-1 px-2">
                <Number n={prejuniors} />
                <p className="col-12 m-1">Pre-junior y Pre-joyas</p>
              </div>
              <a
                href="/dashboard/dest/explo"
                className="text-decoration-none d-flex justify-content-center align-items-center text-white fondo_verde_oscuro m-0 p-2 rounded-bottom-2 letra_muy_pequeña text-center"
              >
                <p className="mb-0 me-2">Mas información</p>
                <i class="bi bi-arrow-right-square"></i>
              </a>
            </aside>

            <aside className="row fondo_amarillo col-12 col-md-4 rounded mx-2 my-3 p-0 ancho ">
              <div className="col-8 row d-flex flex-column align-items-center text-dark text-white py-1 px-2">
                <Number n={pioneros} />
                <p className="col-12 m-1">Junior y Joyas</p>
              </div>
              <a
                href="/dashboard/admin/explo"
                className="text-decoration-none d-flex justify-content-center align-items-center text-white fonde_amarillo_oscuro m-0 p-2 rounded-bottom-2 letra_muy_pequeña text-center"
              >
                <p className="mb-0 me-2">Mas información</p>
                <i class="bi bi-arrow-right-square"></i>
              </a>
            </aside>

            <aside className="row fondo_salmon col-12 col-md-4 rounded mx-2 my-3 p-0 ancho ">
              <div className="col-8 row d-flex flex-column align-items-center text-dark text-white py-1 px-2">
                <Number n={brijers} />
                <p className="col-12 m-1">Brijers</p>
              </div>
              <a
                href="/dashboard/dest/explo"
                className="text-decoration-none d-flex justify-content-center align-items-center text-white fondo_salmon_oscuro m-0 p-2 rounded-bottom-2 letra_muy_pequeña text-center"
              >
                <p className="mb-0 me-2">Mas información</p>
                <i class="bi bi-arrow-right-square"></i>
              </a>
            </aside>
            
           
            <aside className="row fondo-morado col-12 col-md-4 rounded mx-2 my-3 p-0 ancho ">
              <div className="col-8 row d-flex flex-column align-items-center text-dark text-white py-1 px-2">
                <Number n={oficiales} />
                <p className="col-12 m-1">Oficiales</p>
              </div>
              <a
                href="/dashboard/dest/explo"
                className="text-decoration-none d-flex justify-content-center align-items-center text-white fondo-morado-oscuro m-0 p-2 rounded-bottom-2 letra_muy_pequeña text-center"
              >
                <p className="mb-0 me-2">Mas información</p>
                <i class="bi bi-arrow-right-square"></i>
              </a>
            </aside>
          </div>
          <BarChart data={dataExplo} />
        </>
      )}
    </main>
  );
};

export default Dashboard_dest;
