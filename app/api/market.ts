
// export interface MarketRecord {
//   state: string;
//   district: string;
//   market: string;
//   commodity: string;
//   variety: string;
//   arrival_date: string;
//   min_price: number;
//   max_price: number;
//   modal_price: number;
// }

export interface MarketRecord {
  arrival_date: string;   // e.g. "04/09/2025"
  commodity: string;      // e.g. "Wheat"
  district: string;       // e.g. "Sambhal"
  grade: string;          // e.g. "Non-FAQ"
  market: string;         // e.g. "Bhehjoi"
  max_price: string;      // e.g. "2540"
  min_price: string;      // e.g. "2500"
  modal_price: string;    // e.g. "2520"
  state: string;          // e.g. "Uttar Pradesh"
  variety: string;        // e.g. "Dara"
}


// {
//       "arrival_date": "04/09/2025",
//       "commodity": "Wheat",
//       "district": "Sambhal",
//       "grade": "Non-FAQ",
//       "market": "Bhehjoi",
//       "max_price": "2540",
//       "min_price": "2500",
//       "modal_price": "2520",
//       "state": "Uttar Pradesh",
//       "variety": "Dara"
//     }

export interface MarketResponse {
  success: boolean;
  count: number;
  records: MarketRecord[];
}

const BASE_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const API_KEY = "579b464db66ec23bdd0000013efcb73e0432466a4307e486b0fa78c8";

export async function getMarketData(
  state: string,
  district: string,
  commodity: string,
  limit: number = 10
): Promise<MarketResponse> {
  let url = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=${limit}`;
  if (state && state.trim().length > 0) {
    url += `&filters[state.keyword]=${encodeURIComponent(state)}`;
  }
  url += `&filters[commodity]=${encodeURIComponent(commodity)}`;
  if (district && district.trim().length > 0) {
    url += `&filters[district]=${encodeURIComponent(district)}`;
  }

    // console.log("state: ", state);r
    // console.log("district: ", district);
    // console.log("commodity: ", commodity);
    
    // console.log("url::: ", url)


  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);

  const data = await res.json();

  // console.log("inside api call: ", data)

  return data;
}
