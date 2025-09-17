import { getPIB, getExchangeRates } from './api.js';

export function convertToDollars(year: number, value: number, exchangeRates: Map<number, number>): number {
  const exchangeRate = exchangeRates.get(year);
  if (exchangeRate === undefined) {
    throw new Error(`Exchange rate not found for year ${year}`);
  }
  return value * exchangeRate;
}

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
    
    Object.entries(pibData).forEach(([yearStr, value]) => {
      const year = parseInt(yearStr);
      const dollarValue = convertToDollars(year, value, exchangeRates);
      pibInDollars.set(year, dollarValue);
    });

    return pibInDollars;
  } catch (error) {
    console.error('Error calculating PIB in dollars:', error);
    return null;
  }
}

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

console.log(await getPIBInDollars())