import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import {
  StateProps,
  ExploAction,
  ExploReducer,
  initialState,
} from "./ExploReducer";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../funciones.jsx";
import axios from "axios";
import { DecodedToken } from "./types.js";

type ExploContextProps = {
  state: StateProps;
  dispatch: React.Dispatch<ExploAction>;
  setUser: (userData: string) => void;
  Logout: () => void;
};

type ExploProviderProps = {
  children: ReactNode;
};

export const ExploContext = createContext<ExploContextProps>(
  {} as ExploContextProps
);

export const ExploProvider = ({ children }: ExploProviderProps) => {
  const [state, dispatch] = useReducer(ExploReducer, initialState);

  const fetchDestacamentos = async () => {
    try {
      const url = `${api}backend/destacamentos`;
      const { data } = await axios(url);

      if (data) {
        dispatch({
          type: "add_destacamentos",
          payload: { destacamentos: data },
        });
        dispatch({ type: "reset_flag_destacamentos" });
      }
    } catch (error) {
      console.error("Error al cargar destacamentos:", error);
    }
  };

  useEffect(() => {
    if (state.flag_destacamentos) {
      fetchDestacamentos();
    }
  }, [state.flag_destacamentos]);

  const getAscensos = async () => {
    try {
      const url = `${api}backend/ascensos`;
      const { data } = await axios(url);
      if (data) {
        dispatch({ type: "add_ascensos", payload: { ascensos: data } });
        dispatch({ type: "reset_flag_ascensos" });
      }
    } catch (error) {
      console.error("Hubo un problema con la solicitud", error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (state.flag_ascensos) {
      getAscensos();
    }
  }, [state.flag_ascensos]);

  // Función para actualizar usuario
  const setUser = useCallback((userData: string) => {
    localStorage.setItem("token", userData);

    const data_decode: DecodedToken = jwtDecode(userData);
    dispatch({ type: "add_user", payload: { info: data_decode.data } });
    dispatch({ type: "add_token_exp", payload: { exp: data_decode.exp } });
  }, []);

  useEffect(() => {
    const info = localStorage.getItem("token");
    if (info) {
      const token: DecodedToken = jwtDecode(info);

      dispatch({ type: "add_user", payload: { info: token.data } });
      dispatch({ type: "add_token_exp", payload: { exp: token.exp } });
    }
  }, []);

  const Logout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch({ type: "delete_user" });
    location.href = "/";
  }, []);

  return (
    <ExploContext.Provider
      value={{
        state,
        dispatch,
        setUser,
        Logout,
      }}
    >
      {children}
    </ExploContext.Provider>
  );
};
