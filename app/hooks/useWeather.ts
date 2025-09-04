// app/hooks/useWeather.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { getWeather, WeatherResponse } from '../api/weather';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { weather, loading, error };
};
