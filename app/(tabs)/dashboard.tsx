// import { View, Text } from "react-native"

// export default function Dashboard() {
//     return (
//         <View>
//             <Text className="text-5xl text-red-600">Ist es in DASHBOARD!!!</Text>
//         </View>
//     )
// }

// app/tabs/dashboard.tsx
import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import WeatherCard from "@/components/WeatherCard";
import MarketCard from "@/components/MarketCard";
// import PhotoUploader from "@/components/PhotoUploader";

export default function Dashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>

      {/* Weather Section */}
      <WeatherCard />
    
       <MarketCard />

       {/* <PhotoUploader /> */}
      {/* Other dashboard components can go here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
