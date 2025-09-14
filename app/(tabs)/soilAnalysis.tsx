import { AppButton } from "@/components/AppButton";
import { AppText } from "@/components/AppText";
import Constants from "expo-constants";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// interface SoilAnalysisRequest {
//   soilType: string;
//   ph: string;
//   nutrients: string;
//   moisture: string;
//   location: string;
//   cropHistory: string;
// }

// interface SoilAnalysisResponse {
//   analysis: string;
//   recommendations: string[];
//   improvements: string[];
//   nextSteps: string[];
// }


// // -------------------- TYPES --------------------
// interface NutrientLevels {
//   nitrogen: string;
//   phosphorus: string;
//   potassium: string;
// }

// interface SoilAnalysis {
//   cropHistory: string[];
//   location: string;
//   moistureContent: string;
//   nutrientLevels: NutrientLevels;
//   pHLevel: number;
//   soilType: string;
// }

// interface RecommendationItem {
//   description: string;
//   suitableCrops?: string[];
//   recommendations?: string[];
//   applicationRate?: string;
// }

// interface SoilAnalysisResponse {
//   analysis: SoilAnalysis;
//   recommendations: Record<string, RecommendationItem>;
//   improvements: Record<string, string>;
//   nextSteps: string[];
// }

// interface SoilAnalysisRequest {
//   soilType: string;
//   ph: string;
//   nutrients: string;
//   moisture: string;
//   location: string;
//   cropHistory: string;
// }


interface SoilAnalysis {
  soilType: string;
  pHLevel: number;
  moistureContent: string;
  location: string;
  cropHistory: string[] | string;
  nutrientLevels: {
    Nitrogen?: string;
    Phosphorus?: string;
    Potassium?: string;
  };
}

interface ImprovementItem {
  action: string;
  details: string;
}

// interface NextStep {
//   step: string;
//   details: string;
// }

interface RecommendationItem {
  description?: string;          // for simple description-only recs
  suitableCrops?: string[];      // e.g., ["Legumes", "Millets"]
  recommendations?: string[];    // nested recs array
  action?: string;               // e.g., "Lime Application"
  details?: string;              // explanation for action
  applicationRate?: string;      // e.g., "5–10 tons per hectare"
}


interface SoilAnalysisResponse {
  analysis: SoilAnalysis;
  improvements: { [key: string]: ImprovementItem };
  nextSteps: string[];
  recommendations: { [key: string]: RecommendationItem };
}


export interface SoilAnalysisRequest {
  soilType: string;              // e.g. "Clay", "Sandy", "Loam"
  ph: string;               // e.g. 5.5
  moisture: string;       // e.g. "Dry", "Moist", "Wet"
  location: string;              // e.g. "Noida Uttar Pradesh"
  cropHistory: string;         // e.g. ["Wheat", "Rice"]
  nutrients: string;
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
        const cleaned = content.replace(/```json|```/g, "").trim();
        const parsedAnalysis = JSON.parse(cleaned);
        console.log("parsed analysis:: ",parsedAnalysis)
        setAnalysis(parsedAnalysis);
      } catch (parseError) {
        console.log("parsed error:: ", parseError)
        // console.log("here::::::", content)
        // setAnalysis({
        //   analysis: content,
        //   recommendations: ["Please consult with a local agricultural expert for detailed recommendations."],
        //   improvements: ["Regular soil testing is recommended."],
        //   nextSteps: ["Schedule a follow-up soil test in 3-6 months."]
        // });
        setAnalysis({
  analysis: {
    soilType: "Unknown",
    pHLevel: 0,
    moistureContent: "Unknown",
    location: "Unknown",
    cropHistory: [],
    nutrientLevels: {
      Nitrogen: "Unknown",
      Phosphorus: "Unknown",
      Potassium: "Unknown",
    },
  },
  recommendations: {
    general: {
      description: "Please consult with a local agricultural expert for detailed recommendations.",
    },
  },
  improvements: {
    general: {
      action: "Regular soil testing",
      details: "Conduct soil tests every 3–6 months to monitor and improve fertility.",
    },
  },
  nextSteps: ["Schedule follow-up soil test",
      "Reassess soil health in 3–6 months and adjust practices accordingly.",
  ],
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

           {/* {analysis && (
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

   */}
          
          {/* --- RESULTS --- */}
        {analysis && (
          <>
            <View style={styles.card}>
        <Text style={styles.title}>📊 Soil Analysis</Text>
        <Text>Soil Type: {analysis.analysis.soilType}</Text>
        <Text>pH Level: {analysis.analysis.pHLevel}</Text>
        <Text>Moisture: {analysis.analysis.moistureContent}</Text>
        <Text>Location: {analysis.analysis.location}</Text>
        <Text>
          Crop History:{" "}
          {Array.isArray(analysis.analysis.cropHistory)
            ? analysis.analysis.cropHistory.join(", ")
            : analysis.analysis.cropHistory || "N/A"}
        </Text>

        <Text style={styles.subTitle}>Nutrient Levels:</Text>
        <Text>• Nitrogen: {analysis.analysis.nutrientLevels.Nitrogen}</Text>
        <Text>• Phosphorus: {analysis.analysis.nutrientLevels.Phosphorus}</Text>
        <Text>• Potassium: {analysis.analysis.nutrientLevels.Potassium}</Text>
      </View>

      {/* Recommendations */}
      <View style={styles.card}>
        <Text style={styles.title}>💡 Recommendations</Text>
        {/* {Object.entries(analysis.recommendations).map(([key, rec]) => (
          <View key={key} style={{ marginBottom: 10 }}>
            <Text style={styles.subTitle}>{key}</Text>
            {rec.action && <Text>Action: {rec.action}</Text>}
            {rec.details &&
              (typeof rec.details === "string" ? (
                <Text>Details: {rec.details}</Text>
              ) : (
                Object.entries(rec.details).map(([k, v]) => (
                  <Text key={k}>
                    {k}: {v}
                  </Text>
                ))
              ))}
            {rec.recommendations &&
              rec.recommendations.map((r, i) => (
                <Text key={i}>• {r}</Text>
              ))}
          </View>
        ))} */}
        {Object.entries(analysis.recommendations).map(([key, value]: [string, any], idx) => (
      <View key={idx} style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{key}</Text>
        
        {/* Every recommendation has a "recommendation" field */}
        {value.recommendation && (
          <Text style={{ marginTop: 4 }}>{value.recommendation}</Text>
        )}

        {/* Optional fields */}
        {value.suitableCrops && (
          <Text style={{ marginTop: 4 }}>
            Suitable Crops: {value.suitableCrops.join(", ")}
          </Text>
        )}

        {value.methods && (
          <Text style={{ marginTop: 4 }}>
            Methods: {value.methods.join(", ")}
          </Text>
        )}

        {value.applicationTiming && (
          <Text style={{ marginTop: 4 }}>
            Application Timing: {value.applicationTiming}
          </Text>
        )}

        {value.specificFertilizers && (
          <Text style={{ marginTop: 4 }}>
            Fertilizers: {JSON.stringify(value.specificFertilizers)}
          </Text>
        )}

        {value.method && (
          <Text style={{ marginTop: 4 }}>
            Method: {value.method}
          </Text>
        )}
      </View>
    ))}
      </View>

      {/* Improvements */}
      {/* <View style={styles.card}>
        <Text style={styles.title}>🔧 Improvements</Text>
        {Object.entries(analysis.improvements).map(([key, imp]) => (
          <View key={key} style={{ marginBottom: 10 }}>
            <Text style={styles.subTitle}>{imp.action}</Text>
            <Text>{imp.details}</Text>
          </View>
        ))}
      </View> */}
      <View style={{ marginTop: 16 }}>
    <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
      Improvements
    </Text>

    {Object.entries(analysis.improvements).map(([key, value]: [string, any], idx) => (
      <View key={idx} style={{ marginBottom: 12 }}>
        <Text style={{fontSize: 16 }}>{key}</Text>

        {/* Recommendation text */}
        {value.recommendation && (
          <Text style={{ marginTop: 4, fontSize: 30 }}>{value.recommendation}</Text>
        )}

        {/* Suggested cover crops (array) */}
        {value.suggestedCoverCrops && (
          <Text style={{ marginTop: 4 }}>
            Suggested Cover Crops: {value.suggestedCoverCrops.join(", ")}
          </Text>
        )}

        {/* Suggested rotation (array) */}
        {value.suggestedRotation && (
          <Text style={{ marginTop: 4 }}>
            Suggested Rotation: {value.suggestedRotation.join(", ")}
          </Text>
        )}

        {/* Method text */}
        {value.method && (
          <Text style={{ marginTop: 4 }}>
            Method: {value.method}
          </Text>
        )}
      </View>
    ))}
  </View>

      {/* Next Steps */}
      {/* <View style={styles.card}>
        <Text style={styles.title}>📋 Next Steps</Text>
        {analysis.nextSteps.map((step, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <Text style={styles.subTitle}>{step.step}</Text>
            <Text>{step.details}</Text>
          </View>
        ))}
      </View> */}
     <View style={{ marginTop: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
        📋 Next Steps
      </Text>

      {analysis.nextSteps.map((step, index) => (
        <Text key={index} style={{ marginBottom: 4 }}>
          • {step}
        </Text>
      ))}
    </View>

          </>
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
 container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
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
  subTitle: { fontSize: 16, fontWeight: "600", marginTop: 6, color: "#374151" },
});






