import "./globals.css";

import { Stack } from "expo-router";
import { AuthProvider } from "./context/Authcontext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
