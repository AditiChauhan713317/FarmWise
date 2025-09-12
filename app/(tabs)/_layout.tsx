import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="weather" options={{ title: "Weather" }} />
      <Tabs.Screen name="pestDetection" options={{ title: "Pest" }} />
      <Tabs.Screen name="cropRecommendation" options={{ title: "Crop Recommendation" }} />
      <Tabs.Screen name="FertilizerAnalysis" options={{ title: "FertilizerAnalysis" }} />
      <Tabs.Screen name="logout" options={{ title: "Logout" }} />
    </Tabs>
  );
}


