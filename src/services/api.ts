export async function getPIB() {
    const api_url = "https://servicodados.ibge.gov.br/api/v3/agregados/6784/periodos/1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020|2021|2022/variaveis/9808|9812?localidades=N1[all]";
    
    try {    
        const response = await fetch(api_url);
        const data = await response.json();
        // console.log(data);

        const PIB = data[0].resultados[0].series[0].serie;
        // console.log(PIB);

        const PIBPC = data[1].resultados[0].series[0].serie;
        // console.log(PIBPC)

        return [PIB, PIBPC]
    } catch (error) {
        console.error(error)
    }

}

// getPIB();

export async function getDol() {
    const api_url = "http://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='BM_ERV')"

    try {
        const response = await fetch(api_url);
        const data = await response.json();
        // console.log(data);
        
        const cambios = new Map<number, number>();

        data.value.forEach((element: any) => {
            const year = parseInt(element.VALDATA.slice(0, 4));
            // console.log(year)

            // const cambio = Math.round(parseFloat(element.VALVALOR) * 100) / 100;
            const cambio = element.VALVALOR;
            // console.log(cambio);

            cambios.set(year, cambio);
            // console.log(cambios)
        });

        // console.log(cambios);

        return cambios

    } catch (error) {
        // console.error(error)
    }
}

// getDol();

export function convertToDol(year: number, value: number, map: Map<number, number>) {
    const exchangeRate = map.get(year);
    if (exchangeRate === undefined) {
        throw new Error(`Exchange rate not found for year ${year}`);
    }
    const dolVal = value * exchangeRate;
    return dolVal;
}

export async function getPIBDol() {
    const map = await getDol();
    
    try {
        const PIB_PIBPC = await getPIB();
        if (PIB_PIBPC && map) {
            const PIB = PIB_PIBPC[0];
            
            const PIBDol = new Map<number, number>()

            Object.keys(PIB).forEach((element) => {
                console.log(element, PIB[element]);
                const year = parseInt(element);
                const val = PIB[element];
                const dolVal = convertToDol(year, val, map);
                PIBDol.set(year, dolVal);
            })
            console.log(PIBDol);
            return PIBDol;

        }
    } catch (error) {
        console.error(error)
    }
}

getPIBDol();