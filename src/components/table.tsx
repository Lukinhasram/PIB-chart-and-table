import { useState, useEffect } from 'react';
import { getPIBInDollars, getPIBPerCapitaInDollars } from '../services/pibCalculations.js';

interface PIBData {
  year: number;
  pib: number;
  pibPerCapita: number;
}

function PIBTable() {
  const [data, setData] = useState<PIBData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [pibData, pibPerCapitaData] = await Promise.all([
        getPIBInDollars(),
        getPIBPerCapitaInDollars()
      ]);

      if (pibData && pibPerCapitaData) {
        const combined: PIBData[] = [];
        pibData.forEach((pib, year) => {
          const pibPerCapita = pibPerCapitaData.get(year);
          if (pibPerCapita) {
            combined.push({ year, pib, pibPerCapita });
          }
        });
        combined.sort((a, b) => a.year - b.year);
        setData(combined);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Brazilian PIB (USD)</h1>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>PIB</th>
            <th>PIB Per Capita</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.year}>
              <td>{row.year}</td>
              <td>${row.pib.toLocaleString()}</td>
              <td>${row.pibPerCapita.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PIBTable;