import { Ascenso, Destacamento } from "./types";

export type ExploAction = 
{ type: "add_user", payload: {info: StateProps['user_info']}} |
{ type: "delete_user"} |
{ type: "add_token_exp", payload: {exp: StateProps['token_exp']}} |
{ type: "add_destacamentos", payload: {destacamentos: Destacamento[]}} |
{ type: "change_destacamentos"} | 
{ type: "reset_flag_destacamentos"} |
{ type: "add_ascensos", payload: {ascensos: Ascenso[]}} |
{ type: "change_ascensos"} | 
{ type: "reset_flag_ascensos"} 


export type StateProps = {
  user_info: {
    nombre: string;
    apellido: string;
    destacamento: string;
    destacamento_id: string;
    id: string;
    role: string;
    email: string;
  }
  token_exp: number,
  destacamentos: Destacamento[]
  flag_destacamentos: boolean
  ascensos: Ascenso[]
  flag_ascensos: boolean
};

export const initialState: StateProps = {
  user_info: {
    nombre: "",
    apellido: "",
    destacamento: "",
    destacamento_id: "",
    id: "",
    role: "",
    email: "",
  },
  token_exp: 0,
  destacamentos: [],
  flag_destacamentos: true,
  ascensos: [],
  flag_ascensos: true
};

export const ExploReducer = (state: StateProps = initialState, action: ExploAction) =>{

  if(action.type === "add_user"){
    return{
      ...state,
      user_info: action.payload.info
    }
  }

  if(action.type === "add_token_exp"){
    return{
      ...state,
      token_exp: action.payload.exp
    }
  }

  if(action.type === "delete_user"){
    return{
      user_info: {
        nombre: "",
        apellido: "",
        destacamento: "",
        destacamento_id: "",
        id: "",
        role: "",
        email: "",
      },
      token_exp: 0,
      destacamentos: [],
      flag_destacamentos: true,
      ascensos: [],
      flag_ascensos: true
    }
  }

  if(action.type === "add_destacamentos"){
    return {
      ...state,
      destacamentos: action.payload.destacamentos
    }
  }

  if(action.type === "add_ascensos"){
    return {
      ...state,
      ascensos: action.payload.ascensos
    }
  }

  if(action.type === "change_destacamentos"){
    return {
      ...state,
      flag_destacamentos: true
    }
  }

  if(action.type === "reset_flag_destacamentos"){
    return {
      ...state,
      flag_destacamentos: false
    }
  }

  if(action.type === "change_ascensos"){
    return {
      ...state,
      flag_ascensos: true
    }
  }

  if(action.type === "reset_flag_ascensos"){
    return {
      ...state,
      flag_ascensos: false
    }
  }

  return state;
  
}
