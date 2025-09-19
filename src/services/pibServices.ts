import { getPIB, getExchangeRates } from './api.js';

export interface PIBData {
  year: number;
  pib: number;
  pibPerCapita: number;
}

// converte o valor em reais para dolares para um determinado ano
// exchangeRates é um mapa de ano -> taxa de cambio (BRL por 1 USD)
export function convertToDollars(year: number, value: number, exchangeRates: Map<number, number>): number {
  const exchangeRate = exchangeRates.get(year);
  if (exchangeRate === undefined) {
    throw new Error(`Exchange rate not found for year ${year}`);
  }
  return value / exchangeRate;
}

// obtem o pib total em dolares por ano
// aqui o valor do pib vem em milhoes de reais

export async function getPIBInDollars(): Promise<Map<number, number> | null> {
  try {
    const [pibData, exchangeRates] = await Promise.all([
      getPIB(false),
      getExchangeRates()
    ]);
    
    if (!pibData || !exchangeRates) {
      throw new Error('Failed to fetch required data');
    }
    
    const pibInDollars = new Map<number, number>();
    
    Object.entries(pibData).forEach(([yearStr, pib]) => {
      const year = parseInt(yearStr);
      const pibInReais = pib * 10**6
      const dollarValue = convertToDollars(year, pibInReais, exchangeRates);
      pibInDollars.set(year, dollarValue);
    });

    return pibInDollars;
  } catch (error) {
    console.error('Error calculating PIB in dollars:', error);
    return null;
  }
}

// obtem o pib per capta em dolares por ano
// aqui o valor per capta esta em reais, nao em milhoes de reais
export async function getPIBPerCapitaInDollars(): Promise<Map<number, number> | null> {
  try {
    const [pibpcData, exchangeRates] = await Promise.all([
      getPIB(true),
      getExchangeRates()
    ]);
    
    if (!pibpcData || !exchangeRates) {
      throw new Error('Failed to fetch required data');
    }
    
    const pibpcInDollars = new Map<number, number>();
    
    Object.entries(pibpcData).forEach(([yearStr, value]) => {
      const year = parseInt(yearStr);
      const dollarValue = convertToDollars(year, value, exchangeRates);
      pibpcInDollars.set(year, dollarValue);
    });

    return pibpcInDollars;
  } catch (error) {
    console.error('Error calculating PIB Per Capita in dollars:', error);
    return null;
  }
}

// combina os mapas em uma lista de objetos e ordena por ano em ordem crescente.

export async function fetchPIBData() {
  const [pibData, pibPerCapitaData] = await Promise.all([
    getPIBInDollars(),
    getPIBPerCapitaInDollars(),
  ]);

  if (!pibData || !pibPerCapitaData) return [];

  const combined: PIBData[] = [];

  pibData.forEach((pib, year) => {
    const pibPerCapita = pibPerCapitaData.get(year);
    if (pibPerCapita != null) combined.push({ year, pib, pibPerCapita });
  });

  return combined.sort((a, b) => a.year - b.year);
}