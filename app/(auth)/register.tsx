import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View, Text, TouchableOpacity} from "react-native";
import { useAuth } from "../context/Authcontext";
import BackgroundImage from "@/components/BackgroundImage";

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
      <BackgroundImage source={require("../../assets/plants .png")} />
      <AppText
        weight="bold"
        sizeClassName="text-3xl"
        style={{ color: '#0F172A', textAlign: 'center', marginBottom: 32, fontFamily: "MuseoModerno" }}
      >
        Register
      </AppText>

      <TextInput
        style={styles.input}
        className="bg-[#F5F5F5] text-[#706565]"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        className="bg-[#F5F5F5] text-[#706565]"
        placeholder="Mobile"
        value={mobile}
        keyboardType="phone-pad"
        onChangeText={setMobile}
      />

      

      <TextInput
        style={styles.input}
        className="bg-[#F5F5F5] text-[#706565]"
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        className="bg-[#F5F5F5] text-[#706565]"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View
        style={{
          backgroundColor: "#F5F5F5",
          borderWidth: 0.3,
          borderColor: "#9AF300",
          borderRadius: 1000,
          marginBottom: 16,
          overflow: "hidden", // ensures rounded corners
        }}
        >
          <Picker
            selectedValue={preferredLanguage}
            onValueChange={(itemValue) => setPreferredLanguage(itemValue)}
            style={{
              color: "#706565",
              fontFamily: "Afacad SpaceMono",
              paddingHorizontal: 16,
              paddingVertical: 1.5,
              // height: 55, // adjust as needed
            }}
          >
          <Picker.Item label="Select Language" value="" />
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Hindi" value="hi" />
                <Picker.Item label="Tamil" value="ta" />
                <Picker.Item label="Bengali" value="bn" />
                <Picker.Item label="Telugu" value="te" />
                <Picker.Item label="Gujarati" value="gu" />
          </Picker>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister}>
               <Text className="text-center text-white font-bold text-xl">Register</Text>
      </TouchableOpacity>

      <AppText 
        onPress={() => router.push("/(auth)/login")}
        style={{ color: "#0F172A", textAlign: "center", fontFamily: "Afacad SpaceMono", fontSize: 14 }}
      >
        Already have an account?{" "}
                <Text className="underline">Login</Text>
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
  picker: {
    backgroundColor: "#F5F5F5",
    color: "#706565",
    borderRadius: 1000,
    
    paddingHorizontal: 16,
    marginBottom: 16,
    fontFamily: "Afacad SpaceMono",
  }
});