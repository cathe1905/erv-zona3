import { useEffect, useState } from "react";
import { Pago } from "./reducer/types";
import { RequestActions, RequestStateTypes } from "./reducer/SolicitudesReducer";

type InputProps={
  months: Pago[]
  month: number
  id: string
  paymentsState: RequestStateTypes
  dispatch: React.Dispatch<RequestActions>
}

export default function Input({months,month,id,paymentsState, dispatch}: InputProps) {
  const key = `${id}-${month}`;
  const [monthRequired, setMonthRequired] = useState(false);

  //se comprueba que el mes no este pago, se crea en allInputs, sino Month required es true
  useEffect(() => {

    if (!months.some((item) => item.mes === month)) {
    dispatch({type: "setInput", payload: {input: {[key]: false}}})
    }else{
      setMonthRequired(true);
    }
  }, []);

  return (
    <>
      {monthRequired ? (
        <input checked disabled type="checkbox" />
      ) : (
        <input
          name={key}
          onChange={(e) => dispatch({type:"toogleInput", payload: {input: key, value: e.target.checked}})}
          type="checkbox"
          checked={paymentsState.allInputs[key] || false}
        />
      )}
    </>
  );
}
