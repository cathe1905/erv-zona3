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

// eslint-disable-next-line react/prop-types
const BarChart = ({data}) => {

  // Opciones para la gráfica
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true, // Usa un estilo de punto en lugar del cuadro de color
          color: "#000",       // Color del texto de la leyenda (opcional)
        },
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
          text: "", // Título del eje Y
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
      <div style={{ width: "600px", margin: "20px auto"}}>
      <Bar data={data} options={options} />
    </div>
    </div>
    
  );
};

export default BarChart;
