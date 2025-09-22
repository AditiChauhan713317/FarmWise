import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/Authcontext";
import { soilAnalysis } from "../api/soilAnalysisLLM";
import parseLLMResponse from "../utils/parseLLMresponse";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";


export default function SoilAnalysis() {
  const { supportedLang } = useAuth();

  const [soilType, setSoilType] = useState<string>("");
  const [ph, setPh] = useState<string>("");
  const [nutrients, setNutrients] = useState<string>("");
  const [moisture, setMoisture] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [cropHistory, setCropHistory] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  const analyzeSoil = async () => {
    if (!soilType || !ph || !nutrients || !moisture || !location) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const llmResponse = await soilAnalysis(
        soilType,
        ph,
        nutrients,
        moisture,
        location,
        cropHistory,
        supportedLang
      );

      // Parse JSON 
      const cleaned = parseLLMResponse(llmResponse)

      setAnalysis(cleaned);
    } catch (err) {
      setError("Failed to fetch Soil Analysis");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };


  const speakSoilAnalysis = () => {
  

  let soilText = "";

  if (supportedLang === "hi") {
    soilText = `
      मिट्टी का विश्लेषण
      मिट्टी का प्रकार: ${analysis.soilType}.
      विश्लेषण: ${analysis.analysis}.
      सुझाव: ${analysis.recommendation}.
    `;
  } else {
    soilText = `
      Soil Analysis
      Soil Type: ${analysis.soilType}.
      Analysis: ${analysis.analysis}.
      Recommendation: ${analysis.recommendation}.
    `;
  }

  Speech.speak(soilText, {
    language: supportedLang, // 'hi' for Hindi, 'en' for English
    pitch: 1.0,
    rate: 1.0,
  });
};


const stopSpeech = () => {
    Speech.stop();
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginBottom: 4, alignSelf: "flex-start", borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: "#D9F99D" }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: "#365314" }}>AI Analysis</Text>
          </View>
          <AppText weight="bold" sizeClassName="text-3xl" colorClassName="text-black">
            Soil Analysis
          </AppText>
          <Text style={{ marginTop: 4, fontSize: 14, color: "#4B5563" }}>
            Get detailed soil insights and improvement recommendations.
          </Text>
        </View>

        {/* Form */}
        <View style={{ borderRadius: 24, borderWidth: 1, borderColor: "#D9F99D", backgroundColor: "white", padding: 16, shadowColor: "#D9F99D", shadowOpacity: 0.4, shadowRadius: 10 }}>
          {/* Soil Type */}
          <View style={{ marginBottom: 16 }}>
            <AppText weight="bold" sizeClassName="text-sm" colorClassName="text-foreground" style={{ marginBottom: 4 }}>
              🌱 Soil Type *
            </AppText>
            <TextInput style={styles.input} value={soilType} onChangeText={setSoilType} placeholder="e.g., Clay, Sandy, Loamy" />
          </View>

          {/* pH Level */}
          <View style={{ marginBottom: 16 }}>
            <AppText weight="bold" sizeClassName="text-sm" colorClassName="text-foreground" style={{ marginBottom: 4 }}>
              🧪 pH Level *
            </AppText>
            <TextInput style={styles.input} value={ph} onChangeText={setPh} placeholder="e.g., 6.5" keyboardType="decimal-pad" />
          </View>

          {/* Nutrients */}
          <View style={{ marginBottom: 16 }}>
            <AppText weight="bold" sizeClassName="text-sm" colorClassName="text-foreground" style={{ marginBottom: 4 }}>
              🌿 Nutrient Levels *
            </AppText>
            <TextInput
              style={styles.input}
              value={nutrients}
              onChangeText={setNutrients}
              placeholder="e.g., Low N, High P, Medium K"
              multiline
            />
          </View>

          {/* Moisture */}
          <View style={{ marginBottom: 16 }}>
            <AppText weight="bold" sizeClassName="text-sm" colorClassName="text-foreground" style={{ marginBottom: 4 }}>
              💧 Moisture Content *
            </AppText>
            <TextInput style={styles.input} value={moisture} onChangeText={setMoisture} placeholder="e.g., Dry, Moist, Wet" />
          </View>

          {/* Location */}
          <View style={{ marginBottom: 16 }}>
            <AppText weight="bold" sizeClassName="text-sm" colorClassName="text-foreground" style={{ marginBottom: 4 }}>
              📍 Location *
            </AppText>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g., Noida, Uttar Pradesh" />
          </View>

          {/* Crop History */}
          <View style={{ marginBottom: 16 }}>
            <AppText weight="bold" sizeClassName="text-sm" colorClassName="text-foreground" style={{ marginBottom: 4 }}>
              🌾 Crop History
            </AppText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={cropHistory}
              onChangeText={setCropHistory}
              placeholder="e.g., Wheat, Rice, Vegetables"
              multiline
            />
          </View>

          {/* Analyze Button */}
          <AppButton title={loading ? "Analyzing..." : "🔬 Analyze Soil"} onPress={analyzeSoil} disabled={loading} />

          {error ? (
            <View style={styles.errorCard}>
              <AppText colorClassName="text-red-700" className="text-center">
                ⚠️ {error}
              </AppText>
            </View>
          ) : null}

          {/* LLM Analysis */}
          {analysis ? (
            <View style={{ marginTop: 16 }}>
              <View style={styles.card}>
                <Text style={styles.title}>📊 Soil Analysis</Text>
                <Text>Soil Type: {analysis.soilType}</Text>
                <Text>Analysis: {analysis.analysis}</Text>
                <Text>Recommendation: {analysis.recommendation}</Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                              <TouchableOpacity style={styles.speechIconButton} onPress={speakSoilAnalysis}>
                                <Ionicons name="volume-high" size={28} color="#2563EB" />
                              </TouchableOpacity>
                
                              <TouchableOpacity style={styles.speechIconButton} onPress={stopSpeech}>
                                <Ionicons name="stop-circle" size={28} color="#DC2626" />
                              </TouchableOpacity>
                          </View>
              </View>
            </View>
          ) : null}
        </View>

        {/* Tips */}
        <View style={{ marginTop: 24, borderRadius: 16, borderWidth: 1, borderColor: "#ECFCCB", backgroundColor: "#ECFCCB", padding: 16 }}>
          <Text style={{ fontWeight: "600", color: "#365314" }}>💡 Tips for Better Analysis</Text>
          <View style={{ marginTop: 8 }}>
            <Text style={{ marginBottom: 4, color: "#4B5563" }}>• Use recent soil test results for accuracy</Text>
            <Text style={{ marginBottom: 4, color: "#4B5563" }}>• Include specific location details</Text>
            <Text style={{ color: "#4B5563" }}>• Mention any recent farming practices</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    fontFamily: "SpaceMono",
  },
  textArea: {
    height: 60,
    textAlignVertical: "top",
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#1f2937" },
  speechIconButton: {
    marginHorizontal: 12,
  },
});
