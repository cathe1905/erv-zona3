import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function Input({months,month,id,allInputs,setAllInputs,handleInput,}) {
  const key = `${id}-${month}`;
  const [monthRequired, setMonthRequired] = useState(false);

  //se comprueba que el mes no este pago, se crea en allInputs, sino Month required es true
  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (!months.some((item) => item.mes === month)) {
      setAllInputs((prev) => ({
        ...prev,
        [key]: false,
      }));
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
          onChange={(e) => handleInput(e,key)}
          type="checkbox"
          checked={allInputs[key] || false}
        />
      )}
    </>
  );
}
