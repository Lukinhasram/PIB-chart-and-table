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
import { fetchPIBData, type PIBData } from '../services/pibServices.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PIBChart() {
  const [data, setData] = useState<PIBData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pibData = await fetchPIBData();
        if (!cancelled) setData(pibData);
      } catch (error) {
        if (!cancelled) console.error("Error loading PIB data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div>Loading chart...</div>;

  const formatNumber = (value: number) => {
    if (value >= 1 * 10**12) return `${(value/1 * 10**12).toFixed(1)}T`;
    if (value >= 1 * 10**9) return `${(value / 1 * 10**9).toFixed(1)}B`;
    if (value >= 1 * 10**6) return `${(value / 1 * 10**6).toFixed(1)}M`;
    if (value >= 1 * 10**3) return `${(value / 1 * 10**3).toFixed(1)}K`;
    return value.toString();
  };

  const chartData = {
    labels: data.map(item => item.year.toString()),
    datasets: [
      {
        label: 'PIB (USD)',
        data: data.map(item => item.pib),
        borderColor: '#1bb17a',
        backgroundColor: '#1bb17a3a',
        yAxisID: 'y',
      },
      {
        label: 'PIB Per Capita (USD)',
        data: data.map(item => item.pibPerCapita),
        borderColor: '#f58561',
        backgroundColor: '#f5866148',
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
          text: 'PIB (USD)'
        },
        ticks: {
          callback: function(value: string | number) {
            if (isMobile) {
              return formatNumber(typeof value === 'string' ? parseFloat(value) : value);
            }
            return value;
          }
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
        ticks: {
          callback: function(value: string | number) {
            if (isMobile) {
              return formatNumber(typeof value === 'string' ? parseFloat(value) : value);
            }
            return value;
          }
        }
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Brazilian PIB/PIB Per Capita Evolution',
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default PIBChart;