import { useState, useEffect, useMemo } from 'react';
import { fetchPIBData, type PIBData } from '../services/pibServices.js';

function PIBTable() {
  const [data, setData] = useState<PIBData[]>([]);
  const [loading, setLoading] = useState(true);

  const currencyFmt = useMemo(
    () => new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }), []
  )

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const combined = await fetchPIBData();
        if (!cancelled) setData(combined);
      } catch (e) {
        if (!cancelled) console.error("Failed to load data:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);


  if (loading) return <div>Loading table...</div>;

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>PIB (USD)</th>
            <th>PIB Per Capita (USD)</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.year}>
              <td>{row.year}</td>
              <td>{currencyFmt.format(row.pib)}</td>
              <td>{currencyFmt.format(row.pibPerCapita)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PIBTable;