import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="weather" options={{ title: "Weather" }} />
      <Tabs.Screen name="pestDetection" options={{ title: "Pest" }} />
      <Tabs.Screen name="cropRecommendation" options={{ title: "Crop Recommendation" }} />
      <Tabs.Screen name="soilAnalysis" options={{ title: "Soil Analysis" }} />
      <Tabs.Screen name="logout" options={{ title: "Logout" }} />
    </Tabs>
  );
}


// (tabs)/_layout.tsx
// import { View, Button } from 'react-native';
// import { Tabs } from 'expo-router';
// import { useAuth } from '../context/Authcontext';

// export default function TabsLayout() {

//   const { logout } = useAuth();

  
//   return (
//     <View style={{ flex: 1 }}>
//       {/* Global Header */}
//       <View
//         style={{
//           height: 60,
//           justifyContent: 'center',
//           alignItems: 'flex-end',
//           paddingHorizontal: 20,
//           backgroundColor: '#eee',
//         }}
//       >
//         <Button title="Logout" onPress={logout} />
//       </View>

//       {/* Tabs */}
//       <Tabs screenOptions={{ headerShown: false }}>
// //       <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
// //       {/* <Tabs.Screen name="weather" options={{ title: "Weather" }} />
// //       <Tabs.Screen name="market" options={{ title: "Market" }} />
// //       <Tabs.Screen name="crophealth" options={{ title: "Crop Health" }} />
// //       <Tabs.Screen name="advisory" options={{ title: "Advisory" }} /> */}
// //     </Tabs>
//     </View>
//   );
// }
