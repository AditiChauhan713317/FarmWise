import { AppText } from '@/components/AppText';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { getWeather, WeatherResponse } from '../api/weather';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    getWeather(28.58, 77.33).then(setWeather).catch(console.error);
  }, []);

  if (!weather) return null;

  const todayIndex = 0; // first day is today
  const todayDaily = {
    max: weather.daily.temperature_2m_max[todayIndex],
    min: weather.daily.temperature_2m_min[todayIndex],
    precipitation: weather.daily.precipitation_probability_max[todayIndex],
    date: weather.daily.time[todayIndex],
  };

  const todayHours = weather.hourly.time
    .map((t, i) => ({
      time: t,
      temperature: weather.hourly.temperature_2m[i],
      precipitation: weather.hourly.precipitation[i],
    }))
    .slice(0, 24);

  const isDay = weather.current.is_day === 1;
  const bgColor = isDay ? '#87CEEB' : '#2C3E50';


  return (
    <View style={[styles.container, { backgroundColor: bgColor }]} className='flex flex-col' >

      <View>
        {/* Hourly Forecast */}
      <AppText weight="bold" sizeClassName="text-xl" colorClassName="text-white" className="px-3 py-3">
        Hourly Forecast
      </AppText>
      <FlatList
        data={todayHours}
        horizontal
        keyExtractor={(item) => item.time}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <View style={styles.hourCard}>
            <AppText weight="bold" colorClassName="text-white" sizeClassName="text-sm" className="mb-1">
              {item.time.split("T")[1].slice(0, 5)}
            </AppText>
            <AppText weight="bold" colorClassName="text-white" sizeClassName="text-lg">
              {item.temperature}°C
            </AppText>
            <AppText colorClassName="text-white" sizeClassName="text-xs" className="mt-1 text-center">
              🌧 {item.precipitation} mm
            </AppText>
          </View>
        )}
      />
      </View>

      <View>
        {/* 7-Day Forecast */}
      <AppText weight="bold" sizeClassName="text-xl" colorClassName="text-white" className="px-3 py-3">
        7-Day Forecast
      </AppText>
      <FlatList
        data={weather.daily.time}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <View style={styles.dayCard}>
            <AppText weight="bold" colorClassName="text-white" sizeClassName="text-base" className="mb-2">
              {item}
            </AppText>
            <View>
              <AppText weight="bold" colorClassName="text-red-300" sizeClassName="text-base">
                Max: {weather.daily.temperature_2m_max[index]}°C
              </AppText>
              <AppText weight="bold" colorClassName="text-blue-300" sizeClassName="text-base">
                Min: {weather.daily.temperature_2m_min[index]}°C
              </AppText>
            </View>
            <AppText colorClassName="text-white" sizeClassName="text-sm" className="mt-1">
              🌧 Precipitation: {weather.daily.precipitation_probability_max[index]}%
            </AppText>
          </View>
        )}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 15 },
  // Hourly forecast
hourCard: {
  minWidth: 140,
  minHeight: 100,
  paddingVertical: 16,
  paddingHorizontal: 12,
  marginRight: 12,
  borderRadius: 16,
  backgroundColor: "rgba(255,255,255,0.3)",
  alignItems: "center",
  justifyContent: "space-around",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 3,
},

  // Daily forecast
  dayCard: {
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
});