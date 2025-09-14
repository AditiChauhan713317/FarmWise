// import { Tabs } from "expo-router";

// export default function TabsLayout() {
//   return (
//     <Tabs screenOptions={{ headerShown: false }}>
//       <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
//       <Tabs.Screen name="weather" options={{ title: "Weather" }} />
//       <Tabs.Screen name="pestDetection" options={{ title: "Pest" }} />
//       <Tabs.Screen name="cropRecommendation" options={{ title: "Crop Recommendation" }} />
//       <Tabs.Screen name="soilAnalysis" options={{ title: "Soil Analysis" }} />
//       <Tabs.Screen name="chatbot" options={{ title: "Chatbot" }} /> 
//       <Tabs.Screen name="market" options={{ title: "Market" }} />
//       <Tabs.Screen name="fertilizerAnalysis" options={{ title: "Fertilizer Analysis" }} />
//     </Tabs>
//   );
// }


import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#9AF300",   // active color (green)
        tabBarInactiveTintColor: "#888888", // inactive color (grey)
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="pestDetection"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bug" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cropRecommendation"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="soilAnalysis"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="earth" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="fertilizerAnalysis"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flask" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
