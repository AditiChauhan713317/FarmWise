// app/api/weather.ts
export interface CurrentWeather {
  time: string;
  interval: number;
  is_day: number; // 0 or 1
}

export interface CurrentWeatherUnits {
  time: string;
  interval: string;
  is_day: string;
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  weather_code: number[];
  temperature_2m_mean: number[];
  wind_speed_10m_mean: number[];
}

export interface DailyWeatherUnits {
  time: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_probability_max: string;
  weather_code: string;
  temperature_2m_mean: string;
  wind_speed_10m_mean: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  wind_speed_80m: number[];
  soil_temperature_0cm: number[];
  soil_moisture_3_to_9cm: number[];
}

export interface HourlyWeatherUnits {
  time: string;
  temperature_2m: string;
  precipitation_probability: string;
  precipitation: string;
  wind_speed_80m: string;
  soil_temperature_0cm: string;
  soil_moisture_3_to_9cm: string;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;

  current: CurrentWeather;
  current_units: CurrentWeatherUnits;

  daily: DailyWeather;
  daily_units: DailyWeatherUnits;

  hourly: HourlyWeather;
  hourly_units: HourlyWeatherUnits;
}

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function getWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}` +
              `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,temperature_2m_mean,wind_speed_10m_mean` +
              `&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_80m,soil_temperature_0cm,soil_moisture_3_to_9cm` +
              `&current=is_day`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<WeatherResponse>;
}


