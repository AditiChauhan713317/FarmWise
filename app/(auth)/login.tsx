import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { useAuth } from "../context/Authcontext";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(mobile, password);
      router.replace("/(tabs)/dashboard"); // go to dashboard after login
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <AppText 
        weight="bold" 
        sizeClassName="text-3xl" 
        style={{ color: '#0F172A', textAlign: 'center', marginBottom: 32 }}
      >
        Login
      </AppText>

      <TextInput
        placeholder="Mobile"
        style={styles.input}
        value={mobile}
        keyboardType="phone-pad"
        onChangeText={setMobile}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <AppButton title="Login" onPress={handleLogin} />
      </View>

      <AppText 
        onPress={() => router.push("/(auth)/register")}
        style={{ color: '#2E7D32', textAlign: 'center', marginTop: 16 }}
      >
        Don&apos;t have an account? Register
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20, 
    backgroundColor: "#FFFFFF" 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#E5E7EB", 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "SpaceMono"
  },
  buttonContainer: {
    marginBottom: 16,
  },
});
