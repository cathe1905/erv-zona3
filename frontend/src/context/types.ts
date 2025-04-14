export type Destacamento = {
    capellan: string;
    comandante_femenino: string;
    comandante_general: string;
    comandante_masculino: string;
    id: string;
    inst_bes: string;
    inst_brijer: string;
    inst_pionero: string;
    nombre: string;
    pastor: string;
    secretaria: string;
    tesorero: string;
    zona_id: string;
}

export type Ascenso = {
    id: string
    nombre: string
    rama: string
}
export type DecodedToken = {
    iss: boolean;
    aud: boolean;
    iat: number;
    exp: number;
    data: {
      id: string;
      nombre: string;
      apellido: string;
      email: string;
      role: string;
      destacamento: string;
      destacamento_id: string
    };
  };