import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getPIBInDollars, getPIBPerCapitaInDollars } from '../services/pibCalculations.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PIBData {
  year: number;
  pib: number;
  pibPerCapita: number;
}

async function fetchPIBData(): Promise<PIBData[]> {
  const [pibData, pibPerCapitaData] = await Promise.all([
    getPIBInDollars(),
    getPIBPerCapitaInDollars()
  ]);

  if (!pibData || !pibPerCapitaData) {
    return [];
  }

  const combined: PIBData[] = [];
  pibData.forEach((pib, year) => {
    const pibPerCapita = pibPerCapitaData.get(year);
    if (pibPerCapita) {
      combined.push({ year, pib: pib / 1000000000, pibPerCapita });
    }
  });

  return combined.sort((a, b) => a.year - b.year);
}

function PIBChart() {
  const [data, setData] = useState<PIBData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pibData = await fetchPIBData();
        setData(pibData);
      } catch (error) {
        console.error('Error loading PIB data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading chart...</div>;

  const chartData = {
    labels: data.map(item => item.year.toString()),
    datasets: [
      {
        label: 'PIB (Billions USD)',
        data: data.map(item => item.pib),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y',
      },
      {
        label: 'PIB Per Capita (USD)',
        data: data.map(item => item.pibPerCapita),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Year'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'PIB (Billions USD)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'PIB Per Capita (USD)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Brazilian PIB Evolution',
      },
    },
  };

  return (
    <div style={{height: "90vh", width: "90vw"}}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default PIBChart;