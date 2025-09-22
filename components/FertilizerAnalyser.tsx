// import React, { useState } from "react";
// import { Image, Text, View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { preprocessImage, sendToOCR } from "../app/api/ocr";
// import { analyzeFertilizer } from "../app/api/fertilizerLLM";
// import { AppText } from "@/components/AppText";

// export default function FertilizerAnalyser() {
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [text, setText] = useState<string>("");
//   const [advisory, setAdvisory] = useState<string>("");

//   const [crop, setCrop] = useState<string>("rice");
//   const [stage, setStage] = useState<string>("vegetative");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const pickImage = async () => {
//     try {
//       setError(null);
//       setAdvisory("");
//       setLoading(true);

//       const result = await ImagePicker.launchImageLibraryAsync({
//         base64: true,
//         quality: 0.7,
//       });

//       if (!result.canceled) {
//         const img = result.assets[0];

//         const manipulated = await preprocessImage(img.uri);
//         setImageUri(manipulated.uri);

//         if (manipulated.base64) {
//           const parsedText = await sendToOCR(manipulated.base64);
          
//         // ocr didnt find any text don’t call LLM
//         if (!parsedText) {
//           setError("No text detected from image");
//           return; // don’t call LLM
//         }


//           // found text 
//           setText(parsedText);
//           const llmResponse = await analyzeFertilizer(parsedText, { crop, stage });
//           setAdvisory(llmResponse);
//         } else {
//           setError("❌ Failed to extract image data. Try again.");
//         }
//       }
//     } catch (err) {
//       console.error("Error in OCR/LLM:", err);
//       setError("❌ Something went wrong during analysis. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (


//       <View style={{ paddingHorizontal: 16, paddingTop: 40, }}>
//       <AppText
//         weight="bold"
//         sizeClassName="text-3xl"
//         style={{
//           color: "#0F172A",
//           textAlign: "center",
//           marginBottom: 32,
//           fontFamily: "MuseoModerno",
//         }}
//       >
//         Fertilizer Analysis
//       </AppText>

//       {/* Crop selection */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Select Crop</Text>
//         <View style={styles.optionColumn}>
//           {["Rice", "Wheat", "Maize", "Tomato"].map((item) => (
//             <TouchableOpacity
//               key={item}
//               style={styles.checkboxRow}
//               onPress={() => setCrop(item.toLowerCase())}
//             >
//               <View style={[styles.checkbox, crop === item.toLowerCase() && styles.checked]} />
//               <Text style={styles.checkboxLabel}>{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Crop stage selection */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Crop Stage</Text>
//         <View style={styles.optionColumn}>
//           {["Early growth", "Vegetative", "Flowering", "Harvest"].map((item) => (
//             <TouchableOpacity
//               key={item}
//               style={styles.checkboxRow}
//               onPress={() => setStage(item.toLowerCase())}
//             >
//               <View style={[styles.checkbox, stage === item.toLowerCase() && styles.checked]} />
//               <Text style={styles.checkboxLabel}>{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* OCR Image Preview */}
//       {imageUri && (
//         <View style={styles.card} className="flex flex-col items-center">
//           <Image source={{ uri: imageUri }} style={{ width: 290, height: 290, margin: 12, borderRadius: 12 }} />
//         </View>
//       )}

//       {/* Loader */}
//       {loading && (
//         <View style={{ alignItems: "center", marginVertical: 16 }}>
//           <ActivityIndicator size="large" color="#9AF300" />
//           <Text style={{ marginTop: 8, fontFamily: "Afacad SpaceMono", color: "#706565" }}>
//             Analyzing fertilizer…
//           </Text>
//         </View>
//       )}

//       {/* Error */}
//       {error && (
//         <View style={[styles.card, { backgroundColor: "#ffecec", borderColor: "#ff4d4d" }]}>
//           <Text style={{ color: "#b30000", fontFamily: "Afacad SpaceMono" }}>{error}</Text>
//         </View>
//       )}

//       {/* Advisory */}
//       {advisory ? (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Advice</Text>
//           <Text selectable style={styles.cardText}>
//             {advisory}
//           </Text>
//         </View>
//       ) : null}

//       {/* Upload button */}
//       <TouchableOpacity
//         style={[styles.buttonContainer, loading && { opacity: 0.6 }]}
//         onPress={pickImage}
//         disabled={loading}
//       >
//         <Text className="text-center text-white font-bold text-xl">Upload photo of fertilizer</Text>
//       </TouchableOpacity>

//       </View>

//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     marginBottom: 16,
//     borderRadius: 25,
//     borderWidth: 0.5,
//     borderColor: "#9AF300",
//     backgroundColor: "#F5F5F5",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   cardTitle: {
//     fontWeight: "bold",
//     fontSize: 16,
//     marginBottom: 8,
//     color: "#706565",
//     fontFamily: "Afacad SpaceMono",
//   },
//   cardText: {
//     fontSize: 14,
//     color: "#706565",
//     lineHeight: 20,
//     fontFamily: "Afacad SpaceMono",
//   },
//   optionColumn: {
//     flexDirection: "column",
//     gap: 8,
//   },
//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 1,
//     borderColor: "#9AF300",
//     borderRadius: 4,
//     marginRight: 10,
//     backgroundColor: "#fff",
//   },
//   checked: {
//     backgroundColor: "#9AF300",
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     color: "#706565",
//     fontFamily: "Afacad SpaceMono",
//   },
//   buttonContainer: {
//     backgroundColor: "#9AF300",
//     borderRadius: 1000,
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     marginBottom: 16,
//   },
// });



import React, { useState, useEffect} from "react";
import { Image, Alert, Text, View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { preprocessImage, sendToOCR } from "../app/api/ocr";
import { analyzeFertilizer } from "../app/api/fertilizerLLM";
import { AppText } from "@/components/AppText";
import * as Speech from "expo-speech";
import { useAuth } from "@/app/context/Authcontext";
import parseLLMResponse from "@/app/utils/parseLLMresponse";
import { Ionicons } from "@expo/vector-icons";

export default function FertilizerAnalyser() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [advisory, setAdvisory] = useState<string>("");

  const [crop, setCrop] = useState<string>("rice");
  const [stage, setStage] = useState<string>("vegetative");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // llm resposne
  const [useFertilizer, setUseFertilizer] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [dosage, setDosage] = useState<string>("")
  const [frequency, setFrequency] = useState<string>("")
  const [method, setMethod] = useState<string>("")

  const { supportedLang } = useAuth();
  console.log("supported lang: ", supportedLang)

  const pickImage = async () => {
    try {
      setError(null);
      setAdvisory("");
      setLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const img = result.assets[0];

        const manipulated = await preprocessImage(img.uri);
        setImageUri(manipulated.uri);
        console.log("image uri: ", manipulated.uri)

        if (manipulated.base64) {
          const parsedText = await sendToOCR(manipulated.base64);
          
        // ocr didnt find any text don’t call LLM
        if (!parsedText) {
          setError("No text detected from image");
          return; // don’t call LLM
        }


          // found text 
          setText(parsedText);
          console.log("ocr text: ", parsedText);
          const llmResponse = await analyzeFertilizer(parsedText, { crop, stage }, supportedLang);
          setAdvisory(llmResponse);
          console.log("llm response: ", llmResponse);
          const cleaned = parseLLMResponse(llmResponse)

          setUseFertilizer(cleaned.useFertilizer)
          setReason(cleaned.reason)
          setDosage(cleaned.dosage)
          setFrequency(cleaned.frequency)
          setMethod(cleaned.method)
      
        } else {
          setError("❌ Failed to extract image data. Try again.");
        }
      }
    } catch (err) {
      console.error("Error in OCR/LLM:", err);
      setError("❌ Something went wrong during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 



// const speakAnalysis = () => {
//     if (!advisory) return;

//      Speech.speak(advisory, {
//           language: supportedLang,
//           pitch: 1.0,
//           rate: 1.0,
//     });
//     // Chunk text into manageable sentences for faster start
//     // const chunks = [
//     //   response.analysis,
//     //   ...Object.values(response.improvements),
//     //   ...response.nextSteps,
//     //   ...Object.values(response.recommendations),
//     // ];

//     // chunks.forEach((chunk) => {
//     //   if (chunk.trim().length > 0) {
//     //     Speech.speak(chunk, { language: speakLang });
//     //   }
//     // });
//   };

  const speakFertilizerAdvisory = () => {

  // const advisoryText = `
  //   Recommendation: ${useFertilizer}.
  //   Reason: ${reason}.
  //   Dosage: ${dosage}.
  //   Frequency: ${frequency}.
  //   Method of application: ${method}.
  // `;
  let advisoryText = "";

  if (supportedLang === "hi") {
    advisoryText = `
      क्या ये खाद आपको लगाना चाहिए: ${useFertilizer}.
      कारण: ${reason}.
      मात्रा: ${dosage}.
      आवृत्ति: ${frequency}.
      उपयोग की विधि: ${method}.
    `;
  } else {
    advisoryText = `
      Recommendation: ${useFertilizer}.
      Reason: ${reason}.
      Dosage: ${dosage}.
      Frequency: ${frequency}.
      Method of application: ${method}.
    `;
  }


  Speech.speak(advisoryText, {
    language: supportedLang, // 'hi' for Hindi, 'en' for English
    pitch: 1.0,
    rate: 1.0,
  });
  };

  const stopSpeech = () => {
    Speech.stop();
  };


  return (


      <View style={{ paddingHorizontal: 16, paddingTop: 40, }}>
      <AppText
        weight="bold"
        sizeClassName="text-3xl"
        style={{
          color: "#0F172A",
          textAlign: "center",
          marginBottom: 32,
          fontFamily: "MuseoModerno",
        }}
      >
        Fertilizer Analysis
      </AppText>

      {/* Crop selection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Select Crop</Text>
        <View style={styles.optionColumn}>
          {["Rice", "Wheat", "Maize", "Tomato"].map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.checkboxRow}
              onPress={() => setCrop(item.toLowerCase())}
            >
              <View style={[styles.checkbox, crop === item.toLowerCase() && styles.checked]} />
              <Text style={styles.checkboxLabel}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Crop stage selection */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Crop Stage</Text>
        <View style={styles.optionColumn}>
          {["Early growth", "Vegetative", "Flowering", "Harvest"].map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.checkboxRow}
              onPress={() => setStage(item.toLowerCase())}
            >
              <View style={[styles.checkbox, stage === item.toLowerCase() && styles.checked]} />
              <Text style={styles.checkboxLabel}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* OCR Image Preview */}
      {imageUri && (
        <View style={styles.card} className="flex flex-col items-center">
          <Image source={{ uri: imageUri }} style={{ width: 290, height: 290, margin: 12, borderRadius: 12 }} />
        </View>
      )}

      {/* Loader */}
      {loading && (
        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <ActivityIndicator size="large" color="#9AF300" />
          <Text style={{ marginTop: 8, fontFamily: "Afacad SpaceMono", color: "#706565" }}>
            Analyzing fertilizer…
          </Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={[styles.card, { backgroundColor: "#ffecec", borderColor: "#ff4d4d" }]}>
          <Text style={{ color: "#b30000", fontFamily: "Afacad SpaceMono" }}>{error}</Text>
        </View>
      )}

      {/* Advisory */}
      {advisory ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Advice</Text>
          <Text selectable style={styles.cardText}>
            {useFertilizer}
          </Text>
          <Text selectable style={styles.cardText}>
            {reason}
          </Text>
          <Text selectable style={styles.cardText}>
            {dosage}
          </Text>
          <Text selectable style={styles.cardText}>
            {frequency}
          </Text>
          <Text selectable style={styles.cardText}>
            {method}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity style={styles.speechIconButton} onPress={speakFertilizerAdvisory}>
                <Ionicons name="volume-high" size={28} color="#2563EB" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.speechIconButton} onPress={stopSpeech}>
                <Ionicons name="stop-circle" size={28} color="#DC2626" />
              </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* Upload button */}
      <TouchableOpacity
        style={[styles.buttonContainer, loading && { opacity: 0.6 }]}
        onPress={pickImage}
        disabled={loading}
      >
        <Text className="text-center text-white font-bold text-xl">Upload photo of fertilizer</Text>
      </TouchableOpacity>

      </View>

  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "#9AF300",
    backgroundColor: "#F5F5F5",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#706565",
    fontFamily: "Afacad SpaceMono",
  },
  cardText: {
    fontSize: 14,
    color: "#706565",
    lineHeight: 20,
    fontFamily: "Afacad SpaceMono",
  },
  optionColumn: {
    flexDirection: "column",
    gap: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#9AF300",
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  checked: {
    backgroundColor: "#9AF300",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#706565",
    fontFamily: "Afacad SpaceMono",
  },
  buttonContainer: {
    backgroundColor: "#9AF300",
    borderRadius: 1000,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  speechIconButton: {
    marginHorizontal: 12,
  },
});
