import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View, ImageBackground, Dimensions, TouchableOpacity, Text, Image} from "react-native";
import { useAuth } from "../context/Authcontext";
import BackgroundImage from "@/components/BackgroundImage";


// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");


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
      let message = "Something went wrong";

      try {
        const parsed = JSON.parse(err.message); // parse the JSON string
        if (parsed?.message) message = parsed.message; // extract the actual message
      } catch {
        message = err.message || message; // fallback in case it's not JSON
      }

      Alert.alert("Login Failed", message);
      }
  };

return (
  // <BackgroundImage source={require("../../assets/plants .png")}>
    <View style={styles.container}>
        <BackgroundImage source={require("../../assets/plants .png")} />
      <AppText 
        weight="bold" 
        sizeClassName="text-3xl" 
        style={{ color: '#0F172A', textAlign: 'center', marginBottom: 32, fontFamily: "MuseoModerno"}}
      >
        Login
      </AppText>

      <TextInput
        placeholder="Enter Phone Number"
        className="bg-[#F5F5F5] text-[#706565]"
        style={styles.input}
        value={mobile}
        keyboardType="phone-pad"
        onChangeText={setMobile}
      />

      <TextInput
        placeholder="Password"
        className="bg-[#F5F5F5] text-[#706565]"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
         <Text className="text-center text-white font-bold text-xl">Login</Text>
      </TouchableOpacity>

      <AppText 
        onPress={() => router.push("/(auth)/register")}
        style={styles.text}
      >
         Don&apos;t have an account?{" "}
        <Text className="underline">Register</Text>
      </AppText>

    </View>
    // </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  input: {
    borderWidth: 0.3,
    borderColor: "#9AF300",
    borderRadius: 1000,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: "Afacad SpaceMono",
  },
  buttonContainer: {
    backgroundColor: "#9AF300",
    borderRadius: 1000,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  text: {
    color: "#706565",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    fontFamily: "Afacad SpaceMono",
  },
  
});



