// app/hooks/useMarket.ts
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { getMarketData, MarketResponse } from "../api/market";

export const useMarket = (commodity: string = "Wheat") => {
  const [market, setMarket] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        // const { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== "granted") throw new Error("Location permission denied");

        // // Get coordinates
        // const location = await Location.getCurrentPositionAsync({});
        // const { latitude, longitude } = location.coords;

        // // Reverse geocode to get address info
        // const [place] = await Location.reverseGeocodeAsync({
        //   latitude,
        //   longitude,
        // });

        // const state = place.region || "Uttar Pradesh"; // fallback
        // const district = place.subregion || "Sambhal"; // fallback

        const state = "Uttar Pradesh";
        const district = "Sambhal"; 

        console.log("state:: ", state);
        console.log("district:: ", district);

        // Clean up district name 
        let clean_district = district;
        clean_district = clean_district.replace(/ Division$/i, ""); // remove " Division" suffix
        clean_district = clean_district.replace(/ District$/i, ""); // also safe to strip " District"
        clean_district = clean_district.trim();

        console.log("clean_district:: ", clean_district);


        // Fetch market data
        const data = await getMarketData(state, clean_district , commodity, 10);
        setMarket(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch market data");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [commodity]);

//   console.log("inside useMarket:: ", market);
  return { market, loading, error };
};
