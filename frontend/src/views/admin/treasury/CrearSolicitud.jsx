import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useExplo } from "../../../hook/useExplo";
import useTreasury from "../../../services/useTreasury";
import GrowExample from "../../../components/GrowExample";
import Input from "./Input";
import { toast } from "react-toastify";

export default function CrearSolicitud() {
  const { state } = useExplo();
  const { getAllPayments, isLoading } = useTreasury();
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [params, setParams] = useState({
    año: currentYear.toString(),
    destacamento_id: "",
  });
  const [DataPost, setDataPost] = useState({
    solicitudes: {
      responsable_id: "",
      destacamento_id: "",
      comprobante_imagen: "",
      oficiales_ids: { oficiales: [] },
      relaciones_oficiales_meses: {},
      monto: "",
      valor_cuota: "",
      tasa: "",
      referencia: "",
    },
  });
  const initialMonthsState = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i + 1, false])
  );

  const initialOficialIdState = Object.fromEntries(
    data.map(item => [item.oficial_id, false])
  );  

  const [allInputs, setAllInputs] = useState({});
  const [allInputsMonh, setAllInputsMonths]= useState(initialMonthsState)
  const [allInputsOficiales, setAllInputsOficiales] = useState({initialOficialIdState})
  
  useEffect(() => {
    const fetchPayments = async () => {
      const Payments = await getAllPayments(params);
      setData(Payments.payments);
    };
    if (params.destacamento_id) {
      fetchPayments();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleChange = (e) => {
    setParams({
      ...params,
      [e.target.name]: e.target.value,
    });
  };

  const handleInput = (key) => {
    setAllInputs((prev) => ({
      ...prev,
      [key]: true,
    }));
    // let mapedMonths = { ...DataPost.relaciones_oficiales_meses };
    // const year= params.año;
    // const month= e.target.value;
    // const day= "01"
    // const date= `${year}-${month}-${day}`
    // if (e.target.checked) {
    //   if (mapedMonths[oficial]) {
    //     mapedMonths[oficial] = [...mapedMonths[oficial], date];
    //   } else {
    //     mapedMonths = { ...mapedMonths, [oficial]: [date] };
    //   }
    // } else {
    //   const newMapedMonths = mapedMonths[oficial].filter(
    //     (item) => item !== date
    //   );
    //   mapedMonths[oficial] = newMapedMonths;
    // }
    // setDataPost({
    //   ...DataPost,
    //   relaciones_oficiales_meses: mapedMonths,
    // });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newInputs = Object.fromEntries(
        Object.entries(allInputs).map(([key]) => [key, true])
      );
      setAllInputs(newInputs);
      setAllInputsMonths(initialMonthsState)
      setAllInputsOficiales(initialOficialIdState)
    } else {
      const resetInputs = Object.fromEntries(
        Object.entries(allInputs).map(([key]) => [key, false])
      );
      setAllInputs(resetInputs);
    }
    
  };

  const handleOneMonthAllOfic = (e, month) => {
    data.forEach((oficial) => {
      if (!oficial.meses_pagados.some((oficial) => oficial.mes === month)) {
        if (e.target.checked) {
          setAllInputs((prev) => ({
            ...prev,
            [`${oficial.oficial_id}-${month}`]: true,
          }));
          setAllInputsMonths((prev) => ({
            ...prev,
            [month]: true,
          }));
        } else {
          setAllInputs((prev) => ({
            ...prev,
            [`${oficial.oficial_id}-${month}`]: false,
          }));
          setAllInputsMonths((prev) => ({
            ...prev,
            [month]: false,
          }));
        }
      } else {
        return;
      }
    });
  };

  const handleOneOficAllMonths = (e, id) => {
    
    const oficial= data.find(oficial => oficial.oficial_id === id)
    
      for(let i=1; i <= 12; i++){
        if (!oficial.meses_pagados.some((month) => month.mes === i)) {
          if(e.target.checked){
            setAllInputs((prev) => ({
              ...prev,
              [`${oficial.oficial_id}-${i}`]: true,
            }));
            setAllInputsOficiales((prev) => ({
              ...prev,
              [id]: true,
            }));
          }else{
            setAllInputs((prev) => ({
              ...prev,
              [`${oficial.oficial_id}-${i}`]: false,
            }));
            setAllInputsOficiales((prev) => ({
              ...prev,
              [id]: false,
            }));
          }
        } 
      }
  }

  //extrae los inputs con value true y los agrupa con el id correspondiente
  const getTrueInputs = (inputs) => {
    const trueInputs = {};
    for (const [key, value] of Object.entries(inputs)) {
      if (value === true) {
        const keySplited = key.split("-")
        if(trueInputs[keySplited[0]]){
          trueInputs[keySplited[0]] = [...trueInputs[keySplited[0]], Number(keySplited[1])]
        }else{
          trueInputs[keySplited[0]] = [Number(keySplited[1])]
        }

      }
    }
    return trueInputs;
  };

  //evalua que no hayan meses intercalados sin marcar
  const ConsecutiveMonths = (TrueInputs) => {
    for (const [key, value] of Object.entries(TrueInputs)) {
      const orderArray = [...value].sort((a, b) => a - b); 
      
      // Comenzar desde el segundo elemento (índice 1)
      for(let i = 1; i < orderArray.length; i++) {
        if(orderArray[i] - orderArray[i - 1] !== 1) {
          return true; // Hay huecos
        }
      }
    }
    return false;
  };



  const handleSubmit= (e) =>{
    e.preventDefault()
    const trueInputs= getTrueInputs(allInputs)

    if(ConsecutiveMonths(trueInputs)){
      toast.error('Dejaste algun mes intercalado sin marcar.')
    }
  }

  return (
    <>
      <div className="row d-flex g-3 my-2">
        <div className="col-md-3 col-lg-3 mb-3">
          <select
            className="form-select letra_muy_pequeña"
            value={params.destacamento_id}
            onChange={handleChange}
            name="destacamento_id"
            id="destacamento_id"
          >
            <option value="">Todos los Destacamentos</option>
            {state.destacamentos.length &&
              state.destacamentos.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.nombre}
                </option>
              ))}
          </select>
        </div>
        <div className="col-md-3 col-lg-2 mb-3 letra_muy_pequeña">
          <select
            className="form-select letra_muy_pequeña"
            value={params.año}
            onChange={handleChange}
            name="año"
            id="año"
          >
            <option key={currentYear - 1} value={currentYear - 1}>
              {currentYear - 1}
            </option>
            <option key={currentYear} value={currentYear}>
              {currentYear}
            </option>
          </select>
        </div>
        {params.destacamento_id && (
          <div className="col-md-6 ">
          <input
            className="me-2"
            id="select-all"
            type="checkbox"
            onChange={handleSelectAll}
          />
          <label htmlFor="select-all">
            Seleccionar todos los oficiales y todos los meses
          </label>
        </div>
        )}
        
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center">{GrowExample()}</div>
      ) : data.length ? (
        <>
          <div
            className="table-responsive overflow-y-scroll"
            style={{ maxHeight: "400px" }}
          >
            <Table bordered hover className="table-sticky border-top-1">
              <thead className="table-light ">
                <tr className="letra_muy_pequeña text-center">
                  <th
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 3,
                      backgroundColor: "#f8f9fa",
                      width: "33px",
                      minWidth: "33px",
                    }}
                  >
                    n°
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      left: "33px",
                      zIndex: 3,
                      backgroundColor: "#f8f9fa",
                      minWidth: "140px",
                      width: "140px",
                    }}
                  >
                    Oficial
                  </th>
                  <th>
                    <input checked={allInputsMonh[1]} type="checkbox" onChange={(e) => handleOneMonthAllOfic(e, 1)}/>{" "}Ene
                  </th>
                  <th>
                    <input checked={allInputsMonh[2]} type="checkbox" onChange={(e) => handleOneMonthAllOfic(e, 2)}/>{" "}Feb
                  </th>
                  <th>
                    <input checked={allInputsMonh[3]} type="checkbox" onChange={(e) => handleOneMonthAllOfic(e, 3)}/>{" "} Mar</th>
                  <th>
                    <input
                      type="checkbox" checked={allInputsMonh[4]}
                      onChange={(e) => handleOneMonthAllOfic(e, 4)}
                    />{" "}
                    Abr
                  </th>
                  <th>
                    <input
                      type="checkbox" checked={allInputsMonh[5]}
                      onChange={(e) => handleOneMonthAllOfic(e, 5)}
                    />{" "}
                    May
                  </th>
                  <th>
                    <input
                      type="checkbox" checked={allInputsMonh[6]}
                      onChange={(e) => handleOneMonthAllOfic(e, 6)}
                    />{" "}
                    Jun
                  </th>
                  <th>
                    <input
                      type="checkbox" checked={allInputsMonh[7]}
                      onChange={(e) => handleOneMonthAllOfic(e, 7)}
                    />{" "}
                    Jul
                  </th>
                  <th>
                    <input
                      type="checkbox" checked={allInputsMonh[8]}
                      onChange={(e) => handleOneMonthAllOfic(e, 8)}
                    />{" "}
                    Ago
                  </th>
                  <th>
                    <input
                      type="checkbox" checked={allInputsMonh[9]}
                      onChange={(e) => handleOneMonthAllOfic(e, 9)}
                    />{" "}
                    Sept
                  </th>
                  <th>
                    <input
                      type="checkbox" checked={allInputsMonh[10]}
                      onChange={(e) => handleOneMonthAllOfic(e, 10)}
                    />{" "}
                    Oct
                  </th>
                  <th>
                    <input
                      type="checkbox" checked={allInputsMonh[11]}
                      onChange={(e) => handleOneMonthAllOfic(e, 11)}
                    />{" "}
                    Nov
                  </th>
                  <th>
                    <input
                      type="checkbox" checked={allInputsMonh[12]}
                      onChange={(e) => handleOneMonthAllOfic(e, 12)}
                    />{" "}
                    Dic
                  </th>
                </tr>
              </thead>
              <tbody className="letra_muy_pequeña">
                {data.map((oficial, index) => (
                  <tr key={oficial.oficial_id}>
                    <td
                      style={{
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                        backgroundColor: "white",
                        width: "33px",
                        minWidth: "33px",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        position: "sticky",
                        left: "33px",
                        zIndex: 2,
                        backgroundColor: "white",
                        width: "140px",
                        minWidth: "140px",
                      }}
                    >
                     <input checked={allInputsOficiales[oficial.oficial_id]} type="checkbox" onChange={(e) => handleOneOficAllMonths(e, oficial.oficial_id)} /> {oficial.nombre} {""} {oficial.oficial_id}
                    </td>

                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <td key={month} className="month text-center">
                        <Input
                          months={oficial.meses_pagados}
                          month={month}
                          id={oficial.oficial_id}
                          allInputs={allInputs}
                          setAllInputs={setAllInputs}
                          handleInput={handleInput}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
         
          
          <form onSubmit={handleSubmit} className="row d-flex justify-content-center align-items-center letra_muy_pequeña g-2">
              <div className="col-md-3 d-flex justify-content-center">
                <label className="btn btn-secondary letra_muy_pequeña mb-0">
                  📁 Seleccionar archivo
                  <input type="file"/>
                </label>
              </div>

              <div className="col-md-2 d-flex align-items-center">
                <label className="me-2 mb-0 w-50 text-end" htmlFor="comprobante_imagen">Monto total:</label>
                <input className="form-control form-control-sm w-50" type="text" placeholder="Ej. 1000 bs." />
              </div>

              <div className="col-md-2 d-flex align-items-center">
                <label className="me-2 mb-0 w-25 text-end" htmlFor="tasa">Tasa:</label>
                <input className="form-control form-control-sm w-75" type="text" placeholder="Ejemplo 0.95" />
              </div>

              <div className="col-md-3 d-flex align-items-center">
                <label className="me-2 mb-0 w-50 text-end" htmlFor="digitos">Últimos 4 dígitos:</label>
                <input className="form-control form-control-sm w-50" type="text" placeholder="1234" />
              </div>

              <div className="col-md-2 d-flex justify-content-center">
                <input className="btn btn-primary letra_muy_pequeña" type="submit" value="Enviar Solicitud" />
              </div>
          </form>
 
           
        </>
      ) : (
        <div className="text-center">
          Escoge un destacamento para iniciar la solicitud
        </div>
      )}
    </>
  );
}
