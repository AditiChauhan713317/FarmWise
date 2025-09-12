import { AppText } from '@/components/AppText';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, ScrollView } from 'react-native';
import { getWeather, WeatherResponse } from '../api/weather';
import { useWeather } from '../hooks/useWeather'


const dateFormatter = (day: string) => {

        const date = new Date(day); // convert string to Date object
        const formattedDate = date.toLocaleDateString("en-US", {
          weekday: "long",  // Friday
          day: "2-digit",   // 12
          month: "long",    // September
        });

        return formattedDate

}

export default function WeatherScreen() {
  // const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  const { weather, loading, error } = useWeather(); // top-level call

  // console.log("WEATHER::: ", weather)

  useEffect(() => {
  if (weather) checkSevereWeather(weather);
}, [weather]);


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

  // const isDay = weather.current.is_day === 1;



function checkSevereWeather(data: WeatherResponse) {
  const newAlerts: string[] = [];

  data.daily.time.forEach((date, index) => {
    const precip = data.daily.precipitation_probability_max[index];
    const maxTemp = data.daily.temperature_2m_max[index];

    if (precip >= 70) newAlerts.push(`${dateFormatter(date)}: ⚠️ Heavy Rain Expected`);
    if (maxTemp >= 45) newAlerts.push(`${dateFormatter(date)}: 🔥 Extreme Heat`);
  });

  setAlerts(newAlerts);
}


return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 50, paddingHorizontal: 10}}
      showsVerticalScrollIndicator={false}
    >
        {/* Alert  */}
      {alerts.length > 0 && (
        <View style={{ padding: 12, backgroundColor: 'rgba(255,0,0,0.3)', borderRadius: 10, margin: 10 }}>
          {alerts.map((alert, i) => (
            <AppText key={i} colorClassName="text-white" weight="bold">
              {alert}
            </AppText>
          ))}
        </View>
      )}


      {/* Hourly Forecast */}
      <AppText
        weight="bold"
        sizeClassName="text-xl"
        colorClassName="text-[#706565]"
        style={{ fontFamily: 'Afacad SpaceMono', marginBottom: 10 }}
      >
        Hourly Forecast
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 3, paddingVertical: 5}}>
        {todayHours.map((item) => (
          <View key={item.time} style={styles.hourCard}>
            <AppText weight="bold" colorClassName="text-[#706565]" sizeClassName="text-sm" style={{ fontFamily: 'Afacad SpaceMono', marginBottom: 4 }}>
              {/* normal human time */}
            {(() => {
              const [hourStr, minute] = item.time.split("T")[1].slice(0, 5).split(":");
              let hour = parseInt(hourStr, 10);
              const ampm = hour >= 12 ? "PM" : "AM";
              hour = hour % 12 || 12; // convert 0 => 12
              return `${hour}${minute ? ":" + minute : ""} ${ampm}`;
            })()}

            </AppText>
            <AppText weight="bold" colorClassName="text-[#706565]" sizeClassName="text-lg" style={{ fontFamily: 'Afacad SpaceMono' }}>
              {item.temperature}°C
            </AppText>
            <AppText colorClassName="text-[#706565]" sizeClassName="text-xs" style={{ fontFamily: 'Afacad SpaceMono', marginTop: 4, textAlign: 'center' }}>
              🌧 {item.precipitation} mm
            </AppText>
          </View>
        ))}
      </ScrollView>

      {/* 7-Day Forecast */}
      <AppText
        weight="bold"
        sizeClassName="text-xl"
        colorClassName="text-[#706565]"
        style={{ fontFamily: 'Afacad SpaceMono', marginVertical: 10 }}
      >
        7-Day Forecast
      </AppText>
       {weather.daily.time.map((day, index) => {
        

        return (
          <View key={day} style={styles.dayCard}>
            <AppText
              weight="bold"
              colorClassName="text-[#706565]"
              sizeClassName="text-base"
              style={{ fontFamily: "Afacad SpaceMono", marginBottom: 6 }}
            >
              {dateFormatter(day)}  {/* e.g., Friday, 12 September */}
            </AppText>

            <View>
              <AppText weight="bold" colorClassName="text-red-300" sizeClassName="text-base" style={{ fontFamily: 'Afacad SpaceMono' }}>
                Max: {weather.daily.temperature_2m_max[index]}°C
              </AppText>
              <AppText weight="bold" colorClassName="text-blue-300" sizeClassName="text-base" style={{ fontFamily: 'Afacad SpaceMono' }}>
                Min: {weather.daily.temperature_2m_min[index]}°C
              </AppText>
            </View>

            <AppText colorClassName="text-[#706565]" sizeClassName="text-sm" style={{ fontFamily: "Afacad SpaceMono", marginTop: 6 }}>
              🌧 Precipitation: {weather.daily.precipitation_probability_max[index]}%
            </AppText>
          </View>
        );
        })}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hourCard: {
    minWidth: 140,
    minHeight: 100,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginRight: 12,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: '#9AF300',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  dayCard: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: '#9AF300',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
});