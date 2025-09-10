import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { useAuth } from "../context/Authcontext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register(name, mobile, preferredLanguage, location, password );
      router.replace("/(tabs)/dashboard"); // auto-login after register
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <AppText weight="bold" sizeClassName="text-3xl" colorClassName="text-foreground" className="text-center mb-8">
        Register
      </AppText>

       <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={mobile}
        keyboardType="phone-pad"
        onChangeText={setMobile}
      />
      <Picker
        selectedValue={preferredLanguage}
        onValueChange={(itemValue) => setPreferredLanguage(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Language" value="" />
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Hindi" value="hi" />
        <Picker.Item label="Tamil" value="ta" />
        <Picker.Item label="Bengali" value="bn" />
        <Picker.Item label="Telugu" value="te" />
        <Picker.Item label="Gujarati" value="gu" />
        {/* add as many as you need */}
      </Picker> 
      
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <AppButton title="Register" onPress={handleRegister} className="mb-4" />

      <AppText 
        onPress={() => router.push("/(auth)/login")}
        colorClassName="text-primary" 
        className="text-center mt-4"
      >
        Already have an account? Login
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
});
