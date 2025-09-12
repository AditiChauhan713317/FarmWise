// app/hooks/useMarket.ts
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { getMarketData, MarketResponse } from "../api/market";

export const useMarket = (commodity: string = "Wheat") => {
  const [market, setMarket] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedLocation, setResolvedLocation] = useState<{ state: string; district: string } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        let state = "Uttar Pradesh";
        let district = "Sambhal";

        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            const places = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (places && places.length > 0) {
              const place = places[0];
              state = place.region || state;
              // subregion maps well to districts on Android/iOS in India
              district = (place.subregion || place.city || district);
            }
          }
        } catch (locErr) {
          // fallbacks already set
        }

        let clean_district = district;
        clean_district = clean_district.replace(/ Division$/i, "");
        clean_district = clean_district.replace(/ District$/i, "");
        clean_district = clean_district.trim();

        setResolvedLocation({ state, district: clean_district });

        const data = await getMarketData(state, clean_district, commodity, 10);
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
  return { market, loading, error, resolvedLocation };
};
