import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { analyzePest, PestAnalysisResponse } from "../app/api/pestDetection";
import { pestExplanation } from "@/app/api/pestDetectionLLM";
import { useAuth } from '../app/context/Authcontext'
import parseLLMResponse from "@/app/utils/parseLLMresponse";
  import * as Speech from 'expo-speech';

export default function PhotoUploader() {
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<PestAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [pest, setPest] = useState<string>("")
  const [harm, setHarm] = useState<string>("")
  const [action, setAction] = useState<string>("")

    const { supportedLang } = useAuth();

  if (!permission) {
    return <View />; 
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No access to camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;
      setImageUri(uri);
      console.log("uri:: ", uri)

      try {
        const data = await analyzePest({
          uri,
          type: "image/jpeg",
          name: "photo.jpg",
        });
        setResult(data);
        console.log("API response:", data);

        if(data) {
              const llmResponse = await pestExplanation(data.prediction, supportedLang);
              setExplanation(llmResponse);
              console.log("llm response: ", llmResponse);
              // Parse JSON string into a JavaScript object
              const pestAdvice = parseLLMResponse(llmResponse);

              // Access fields
              console.log("Pest:", pestAdvice.pest);
              console.log("Harm:", pestAdvice.harm);
              console.log("Action:", pestAdvice.action);
              setPest(pestAdvice.pest)
              setHarm(pestAdvice.harm)
              setAction(pestAdvice.action)
        }
        else {
          setError("Error in getting response from pest detection service")
        }

      } catch (error) {
        console.error("Error fetching pest analysis:", error);
      }
    }
  };



// speech
const speakPestAnalysis = () => {


  // Combine all fields into a single string
 let advisoryText = "";

if (supportedLang === "hi") {
  advisoryText = `
    पाए गए कीट: ${pest}.
    होने वाला नुकसान: ${harm}.
    सुझाया गया उपाय: ${action}.
  `;
} else {
  advisoryText = `
    Pest detected: ${pest}.
    Harm caused: ${harm}.
    Recommended action: ${action}.
  `;
}


  // Speak the combined advisory
  Speech.speak(advisoryText, {
    language: supportedLang, // e.g., 'hi' for Hindi, 'en' for English
    pitch: 1.0,
    rate: 1.0,
  });
};

const stopSpeech = () => {
    Speech.stop();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Pest Detection</Text>

      <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
        <View style={styles.imageIcon}>
          <View style={styles.imageIconDot} />
        </View>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      )}
      {/* Error */}
            {error && (
              <View style={[styles.card, { backgroundColor: "#ffecec", borderColor: "#ff4d4d" }]}>
                <Text style={{ color: "#b30000", fontFamily: "Afacad SpaceMono" }}>{error}</Text>
              </View>
            )}


      {result && (
        <>
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Prediction</Text>
          <Text style={styles.resultValue}>{result.prediction}</Text>
        </View>

        {explanation ? (
          <View style={styles.resultBox}>
          {/* <Text style={styles.explanation}>{explanation}</Text> */}
            <Text style={styles.explanation}>{pest}</Text>
          <View style={styles.resultBox}>
            <Text style={styles.explanation}>{harm}</Text>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.explanation}>{action}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity style={styles.speechIconButton} onPress={speakPestAnalysis}>
                <Ionicons name="volume-high" size={28} color="#2563EB" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.speechIconButton} onPress={stopSpeech}>
                <Ionicons name="stop-circle" size={28} color="#DC2626" />
              </TouchableOpacity>
          </View>
        </View>
        ) : null}
        
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    margin: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#84CC16",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  imageIcon: {
    width: 26,
    height: 18,
    backgroundColor: "#ffffff",
    borderRadius: 3,
    position: "relative",
  },
  imageIconDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#84CC16",
    position: "absolute",
    right: 3,
    top: 3,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultBox: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0a0a0a",
  },
  explanation: {
    fontSize: 16,
    color: "#0a0a0a",
  },
  speechIconButton: {
    marginHorizontal: 12,
  },
});