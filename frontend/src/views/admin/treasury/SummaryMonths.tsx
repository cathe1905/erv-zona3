import React from "react";
import { monthsAbrev } from "./funciones";
import type { DataPostType, OficialConPagos } from "./types";

type SummaryMonths = {
  data: OficialConPagos[];
  DataPost: DataPostType;
};
export default function SummaryMonths({ data, DataPost }) {
  const group = (months: string[]) => {
    const groupJoined = months
      .map((month) => {
        return monthsAbrev.find((m) => m.id === month.split("-")[1])?.nombre;
      })
      .join(", ");
    return groupJoined;
  };

  return (
    <>
      {DataPost?.solicitudes?.oficiales_ids?.oficiales?.map((item, index) => (
        <tr key={index} className="letra_muy_pequeña">
          <td>{data.find((oficial) => oficial.oficial_id === item)?.nombre}</td>

          <td>
            {group(DataPost.solicitudes.relaciones_oficiales_meses[item])}
          </td>
        </tr>
      ))}
    </>
  );
}
