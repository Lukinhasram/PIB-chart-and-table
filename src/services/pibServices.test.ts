import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

vi.mock('./api.js', () => ({
  getPIB: vi.fn(),
  getExchangeRates: vi.fn(),
}));

import { convertToDollars, getPIBInDollars, getPIBPerCapitaInDollars, fetchPIBData } from './pibServices';
import { getPIB, getExchangeRates } from './api.js';

const mockedGetPIB = getPIB as unknown as Mock;
const mockedGetExchangeRates = getExchangeRates as unknown as Mock;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('convertToDollars', () => {
  it('converts using the year-specific exchange rate', () => {
    const rates = new Map<number, number>([[2020, 5]]);
    expect(convertToDollars(2020, 10, rates)).toBe(2);
  });

  it('throws when exchange rate for the year is missing', () => {
    const rates = new Map<number, number>();
    expect(() => convertToDollars(2020, 100, rates)).toThrow('Exchange rate not found for year 2020');
  });
});

describe('getPIBInDollars', () => {
  it('returns a Map with PIB converted from millions of BRL to USD', async () => {
    mockedGetPIB.mockResolvedValue({ '2020': 7, '2021': 8 }); 
    mockedGetExchangeRates.mockResolvedValue(new Map<number, number>([
      [2020, 5],
      [2021, 4],
    ]));

    const result = await getPIBInDollars();
    expect(result).not.toBeNull();
    expect(result!.get(2020)).toBeCloseTo(7 * 10**6 / 5); // 1_400_000
    expect(result!.get(2021)).toBeCloseTo(8 * 10 **6 / 4); // 2_000_000
  });
});

describe('getPIBPerCapitaInDollars', () => {
  it('returns a Map with PIB per capita converted to USD', async () => {
    mockedGetPIB.mockResolvedValue({ '2020': 40000, '2021': 50000 }); // BRL per capita
    mockedGetExchangeRates.mockResolvedValue(new Map<number, number>([
      [2020, 5],
      [2021, 4],
    ]));

    const result = await getPIBPerCapitaInDollars();
    expect(result).not.toBeNull();
    expect(result!.get(2020)).toBeCloseTo(40000 / 5); // 8_000
    expect(result!.get(2021)).toBeCloseTo(50000 / 4); // 12_500
  });
});

describe('fetchPIBData', () => {
  it('combines PIB and PIB per capita by year and sorts ascending', async () => {
    // getPIBInDollars()
    mockedGetPIB.mockResolvedValueOnce({ '2019': 6 }); // 6 million BRL
    mockedGetExchangeRates.mockResolvedValueOnce(new Map<number, number>([[2019, 5]]));

    // getPIBPerCapitaInDollars()
    mockedGetPIB.mockResolvedValueOnce({ '2019': 30000, '2020': 35000 });
    mockedGetExchangeRates.mockResolvedValueOnce(new Map<number, number>([
      [2019, 5],
      [2020, 4],
    ]));

    const combined = await fetchPIBData();
    expect(combined).toEqual([
      {
        year: 2019,
        pib: 6 * 10**6 / 5,        // 1_200_000
        pibPerCapita: 30000 / 5, // 6_000
      },
    ]);
  });
})