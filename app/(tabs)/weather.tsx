import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native';
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
      <Text style={styles.sectionTitle}>Hourly Forecast</Text>
      <FlatList
        data={todayHours}
        horizontal
        keyExtractor={(item) => item.time}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <View style={styles.hourCard}>
            <Text style={styles.hourTime}>{item.time.split("T")[1].slice(0, 5)}</Text>
            <Text style={styles.hourTemp}>{item.temperature}°C</Text>
            <Text style={styles.hourRain}>🌧 {item.precipitation} mm</Text>
          </View>
        )}
      />
      </View>

      <View>
        {/* 7-Day Forecast */}
      <Text style={styles.sectionTitle}>7-Day Forecast</Text>
      <FlatList
        data={weather.daily.time}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <View style={styles.dayCard}>
            <Text style={styles.dayDate}>{item}</Text>
            <View>
              <Text style={styles.dayMax}>Max: {weather.daily.temperature_2m_max[index]}°C</Text>
              <Text style={styles.dayMin}>Min: {weather.daily.temperature_2m_min[index]}°C</Text>
            </View>
            <Text style={styles.dayRain}>🌧 Precipitation: {weather.daily.precipitation_probability_max[index]}%</Text>
          </View>
        )}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#fff",
    paddingHorizontal: 10,
  },
  // Hourly forecast
hourCard: {
  minWidth: 140, // wider than before
  minHeight: 100,
  paddingVertical: 16,
  paddingHorizontal: 12,
  marginRight: 12,
  borderRadius: 16,
  backgroundColor: "rgba(255,255,255,0.3)", // slightly brighter for visibility
  alignItems: "center",
  justifyContent: "space-around",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 3,
},
hourTime: { fontWeight: "600", color: "#fff", marginBottom: 6, fontSize: 14 },
hourTemp: { fontSize: 18, fontWeight: "700", color: "#fff" },
hourRain: { fontSize: 13, color: "#fff", marginTop: 6, textAlign: "center" },


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
  dayDate: { fontSize: 16, fontWeight: "600", color: "#fff", marginBottom: 8 },
  dayMax: { fontSize: 16, fontWeight: "700", color: "#FF6B6B" },
  dayMin: { fontSize: 16, fontWeight: "700", color: "#4DA6FF" },
  dayRain: { fontSize: 14, color: "#fff", marginTop: 6 },
});