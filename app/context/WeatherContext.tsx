import React, { createContext, useContext, useEffect, useState } from "react";
import { WeatherResponse, getWeather } from "../api/weather";
import * as Location from 'expo-location';


interface WeatherContextType {
    weather: WeatherResponse | undefined,
    error: string | null,
    loading: boolean,
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);


export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weather, setWeather] = useState<WeatherResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch weather on app start
   useEffect(() => {
    const fetch = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Location permission denied');

        const location = await Location.getCurrentPositionAsync({});
        const lat = location.coords.latitude;
        const lon = location.coords.longitude;

        const data = await getWeather(lat, lon);
        setWeather(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  
  return (
    <WeatherContext.Provider value={{ weather, loading, error}}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeatherContext must be used inside AuthProvider");
  return ctx;
};
