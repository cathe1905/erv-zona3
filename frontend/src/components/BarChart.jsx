import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar componentes necesarios para Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({data}) => {

  // Opciones para la gráfica
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Posición de la leyenda
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Inicia el eje Y en 0
        title: {
          display: true,
          text: "Cantidades", // Título del eje Y
        },
      },
      x: {
        title: {
          display: true,
          text: "Ramas", // Título del eje X
        },
      },
    },
  };

  return (
    <div className="overflow-auto">
      <div style={{ width: "600px", margin: "0 auto"}}>
      <Bar data={data} options={options} />
    </div>
    </div>
    
  );
};

export default BarChart;
