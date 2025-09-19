import "./globals.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "./context/Authcontext";
import { WeatherProvider } from "./context/WeatherContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      if (!fontsLoaded) {
        await SplashScreen.preventAutoHideAsync();
      } else {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <WeatherProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </WeatherProvider>
    </AuthProvider>
  );
}
