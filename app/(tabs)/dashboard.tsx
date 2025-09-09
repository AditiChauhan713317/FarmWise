// import { View, Text } from "react-native"

// export default function Dashboard() {
//     return (
//         <View>
//             <Text className="text-5xl text-red-600">Ist es in DASHBOARD!!!</Text>
//         </View>
//     )
// }

// app/tabs/dashboard.tsx
import { AppText } from "@/components/AppText";
import MarketCard from "@/components/MarketCard";
import PhotoUploader from "@/components/PhotoUploader";
import WeatherCard from "@/components/WeatherCard";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function Dashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppText weight="bold" sizeClassName="text-2xl" colorClassName="text-foreground">
        Dashboard
      </AppText>

      {/* Weather Section */}
      <WeatherCard />
    
       <MarketCard />

       <PhotoUploader />
      {/* Other dashboard components can go here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  // spacing for sections can be added here
});
