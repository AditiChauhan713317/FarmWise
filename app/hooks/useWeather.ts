// app/hooks/useWeather.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { getWeather, WeatherResponse } from '../api/weather';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);


 

  return { weather };
};

