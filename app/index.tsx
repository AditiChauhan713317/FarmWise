// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text className="text-5xl text-blue-800">Hallo! FARMER</Text>
//     </View>
//   );
// }
// app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "./context/Authcontext";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null; // or a splash

  return user ? (
    <Redirect href="/(tabs)/dashboard" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
