interface PIBData {
  PIB: Record<string, number>;
  PIBPC: Record<string, number>;
}

interface ExchangeRateData {
  VALDATA: string;
  VALVALOR: number;
}

export async function getPIB(perCapta: Boolean): Promise<PIBData | null> {
  const api_url = "https://servicodados.ibge.gov.br/api/v3/agregados/6784/periodos/1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020|2021|2022/variaveis/9808|9812?localidades=N1[all]";
  
  try {    
    const response = await fetch(api_url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const PIB = data[0].resultados[0].series[0].serie;
    const PIBPC = data[1].resultados[0].series[0].serie;

    if (perCapta) {
        return PIBPC
    } else {
        return PIB
    }
  } catch (error) {
    console.error('Error fetching PIB data:', error);
    return null;
  }
}

export async function getExchangeRates(): Promise<Map<number, number> | null> {
  const api_url = "http://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='BM_ERV')";

  try {
    const response = await fetch(api_url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const exchangeRates = new Map<number, number>();

    data.value.forEach((element: ExchangeRateData) => {
      const year = parseInt(element.VALDATA.slice(0, 4));
      exchangeRates.set(year, element.VALVALOR);
    });

    return exchangeRates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
}