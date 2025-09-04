// // app/components/WeatherCard.tsx
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import React from 'react';
// import { useWeather } from '../app/hooks/useWeather';

// const WeatherCard: React.FC = () => {
//   const { weather, loading, error } = useWeather();
//  console.log("weatehr::: ", weather);
//   if (loading) {
//     return (
//       <View style={styles.card}>
//         <ActivityIndicator size="small" color="#000" />
//         <Text>Loading weather...</Text>
//       </View>
//     );
//   }

//   if (error || !weather) {
//     return (
//       <View style={styles.card}>
//         <Text>Error loading weather: {error || 'Unknown error'}</Text>
//       </View>
//     );
//   }

//   const { current_weather, daily } = weather;

//   return (
//     <View style={styles.card} className={current_weather.is_day ? 'bg-yellow-400' : 'bg-blue-950'}>
//       <Text style={styles.title}>Current Weather</Text>
//       <Text>Temperature: {current_weather.temperature}°C</Text>
//       <Text>Wind Speed: {current_weather.wind_speed_10m} m/s</Text>
//       <Text>Daytime: {current_weather.is_day ? 'Yes' : 'No'}</Text>

//       <Text style={[styles.title, { marginTop: 10 }]}>Today Forecast</Text>
//       <Text>Max: {daily.temperature_2m_max[0]}°C</Text>
//       <Text>Min: {daily.temperature_2m_min[0]}°C</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: '#fff',
//     margin: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default WeatherCard;


import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { useWeather } from '../app/hooks/useWeather';


const WeatherCard = () => {

    const { weather, loading, error } = useWeather();

    if (loading) {
        return (
            <View style={styles.card}>
            <ActivityIndicator size="small" color="#000" />
            <Text>Loading weather...</Text>
            </View>
        );
    }

    if (error || !weather) {
        return (
            <View style={styles.card}>
            <Text>Error loading weather: {error || 'Unknown error'}</Text>
            </View>
        );
    }

  const todayIndex = 0; // Today's data is the first in daily array
  const todayDaily = weather.daily;
  const isDay = weather.current.is_day === 1;

  // // Dynamic background color
  // const backgroundColor = isDay ? '#87CEEB' : '#2C3E50'; // Day: sky blue, Night: dark blue
  // const textColor = isDay ? '#000' : '#fff';

  const backgroundColor = isDay ? "#87CEEB" : "#2C3E50"; // Day: sky blue, Night: dark blue
  const textColor = isDay ? "#000" : "#fff";

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Today's Weather</Text>

      <View style={styles.tempRow}>
        <View style={styles.tempBox}>
          <Text style={[styles.tempLabel, { color: textColor }]}>Max</Text>
          <Text style={[styles.tempValue, { color: textColor }]}>
            {todayDaily.temperature_2m_max[todayIndex]}°C
          </Text>
        </View>
        <View style={styles.tempBox}>
          <Text style={[styles.tempLabel, { color: textColor }]}>Min</Text>
          <Text style={[styles.tempValue, { color: textColor }]}>
            {todayDaily.temperature_2m_min[todayIndex]}°C
          </Text>
        </View>
        <View style={styles.tempBox}>
          <Text style={[styles.tempLabel, { color: textColor }]}>Mean</Text>
          <Text style={[styles.tempValue, { color: textColor }]}>
            {todayDaily.temperature_2m_mean[todayIndex]}°C
          </Text>
        </View>
      </View>

      <View style={styles.statRow}>
        <Text style={[styles.label, { color: textColor }]}>🌬 Wind Speed</Text>
        <Text style={[styles.value, { color: textColor }]}>
          {todayDaily.wind_speed_10m_mean[todayIndex]} km/h
        </Text>
      </View>

      <View style={styles.statRow}>
        <Text style={[styles.label, { color: textColor }]}>☔ Precipitation</Text>
        <Text style={[styles.value, { color: textColor }]}>
          {todayDaily.precipitation_probability_max[todayIndex]}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  tempRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tempBox: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tempLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  tempValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
  },
});


export default WeatherCard;
