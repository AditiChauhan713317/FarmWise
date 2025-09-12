import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import Constants from "expo-constants";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SoilAnalysisRequest {
  soilType: string;
  ph: string;
  nutrients: string;
  moisture: string;
  location: string;
  cropHistory: string;
}

interface SoilAnalysisResponse {
  analysis: string;
  recommendations: string[];
  improvements: string[];
  nextSteps: string[];
}

export default function SoilAnalysis() {
  const [soilType, setSoilType] = useState<string>("");
  const [ph, setPh] = useState<string>("");
  const [nutrients, setNutrients] = useState<string>("");
  const [moisture, setMoisture] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [cropHistory, setCropHistory] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SoilAnalysisResponse | null>(null);
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
      const apiKey = Constants.expoConfig?.extra?.openaiApiKey;
      
      if (!apiKey) {
        throw new Error("OpenAI API key not found. Please check your environment configuration.");
      }

      const requestData: SoilAnalysisRequest = {
        soilType,
        ph,
        nutrients,
        moisture,
        location,
        cropHistory
      };

      console.log("Making API request with key:", apiKey.substring(0, 10) + "...");

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert agricultural soil scientist. Analyze the provided soil data and give detailed recommendations for soil improvement, crop suitability, and farming practices. Respond in JSON format with analysis, recommendations, improvements, and nextSteps arrays.'
            },
            {
              role: 'user',
              content: `Analyze this soil data:
              - Soil Type: ${soilType}
              - pH Level: ${ph}
              - Nutrient Levels: ${nutrients}
              - Moisture Content: ${moisture}
              - Location: ${location}
              - Crop History: ${cropHistory || 'No previous crops'}
              
              Provide a comprehensive soil analysis with specific recommendations for this farming location.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error Response:", errorData);
        throw new Error(`API request failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      const content = data.choices[0].message.content;
      
      try {
        const parsedAnalysis = JSON.parse(content);
        setAnalysis(parsedAnalysis);
      } catch (parseError) {
        setAnalysis({
          analysis: content,
          recommendations: ["Please consult with a local agricultural expert for detailed recommendations."],
          improvements: ["Regular soil testing is recommended."],
          nextSteps: ["Schedule a follow-up soil test in 3-6 months."]
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to analyze soil data: ${errorMessage}`);
      console.error("Soil analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-5 py-6"
      >
        <View className="mb-6">
          <View className="mb-2 self-start rounded-full bg-gradient-to-r from-lime-200 to-cyan-100 px-3 py-1">
            <Text className="text-[11px] font-semibold text-lime-800">AI Analysis</Text>
          </View>
          <AppText weight="bold" sizeClassName="text-3xl" colorClassName="text-black">
            Soil Analysis
          </AppText>
          <Text className="mt-1 text-base text-gray-600">
            Get detailed soil insights and improvement recommendations.
          </Text>
        </View>

        <View className="rounded-3xl border border-lime-300 bg-white p-4 shadow-lg shadow-lime-100">
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm" className="mb-2">
                🌱 Soil Type *
              </AppText>
              <TextInput
                style={styles.input}
                value={soilType}
                onChangeText={setSoilType}
                placeholder="e.g., Clay, Sandy, Loamy"
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm" className="mb-2">
                🧪 pH Level *
              </AppText>
              <TextInput
                style={styles.input}
                value={ph}
                onChangeText={setPh}
                placeholder="e.g., 6.5"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm" className="mb-2">
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

            <View style={styles.inputGroup}>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm" className="mb-2">
                💧 Moisture Content *
              </AppText>
              <TextInput
                style={styles.input}
                value={moisture}
                onChangeText={setMoisture}
                placeholder="e.g., Dry, Moist, Wet"
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm" className="mb-2">
                📍 Location *
              </AppText>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g., Noida, Uttar Pradesh"
              />
            </View>

            <View style={styles.inputGroup}>
              <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-sm" className="mb-2">
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

            <AppButton
              title={loading ? "Analyzing..." : "🔬 Analyze Soil"}
              onPress={analyzeSoil}
              disabled={loading}
              className="mt-4"
            />

            {error && (
              <View style={styles.errorCard}>
                <AppText colorClassName="text-red-700" className="text-center">
                  ⚠️ {error}
                </AppText>
              </View>
            )}

            {analysis && (
              <View style={styles.resultContainer}>
                <View style={styles.analysisCard}>
                  <AppText weight="bold" colorClassName="text-green-800" sizeClassName="text-lg" className="mb-3">
                    📊 Soil Analysis
                  </AppText>
                  <Text className="text-gray-700">{analysis.analysis}</Text>
                </View>

                <View style={styles.recommendationsCard}>
                  <AppText weight="bold" colorClassName="text-blue-800" sizeClassName="text-base" className="mb-2">
                    💡 Recommendations
                  </AppText>
                  {analysis.recommendations.map((rec, index) => (
                    <Text key={index} className="text-gray-700 mb-1">• {rec}</Text>
                  ))}
                </View>

                <View style={styles.improvementsCard}>
                  <AppText weight="bold" colorClassName="text-orange-800" sizeClassName="text-base" className="mb-2">
                    🔧 Improvements
                  </AppText>
                  {analysis.improvements.map((imp, index) => (
                    <Text key={index} className="text-gray-700 mb-1">• {imp}</Text>
                  ))}
                </View>

                <View style={styles.nextStepsCard}>
                  <AppText weight="bold" colorClassName="text-purple-800" sizeClassName="text-base" className="mb-2">
                    📋 Next Steps
                  </AppText>
                  {analysis.nextSteps.map((step, index) => (
                    <Text key={index} className="text-gray-700 mb-1">• {step}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="mt-6 rounded-2xl border border-lime-200 bg-lime-50 p-4">
          <Text className="font-semibold text-lime-700">💡 Tips for Better Analysis</Text>
          <View className="mt-2">
            <Text className="mb-1 text-gray-700">• Use recent soil test results for accuracy</Text>
            <Text className="mb-1 text-gray-700">• Include specific location details</Text>
            <Text className="text-gray-700">• Mention any recent farming practices</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
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
  resultContainer: {
    marginTop: 20,
  },
  analysisCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  recommendationsCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  improvementsCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  nextStepsCard: {
    backgroundColor: "#FAF5FF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
});
