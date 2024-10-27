import { useState } from "react";

const logIn = async ([datos]) => {
    const [loged, setLoged] = useState(false);
    const [error, setError] = useState();

    try{
        const respuesta= await fetch('http://erv-zona3/backend/users/auth', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if(respuesta.ok){
            setLoged(true);
            localStorage.setItem(respuesta);
        }
    } catch(error){
        console.error('Hubo un problema con la solicitud', error)
        setError(error);
    }
}

return (
    <div>
        <form >
            
        </form>
    
    </div>
)