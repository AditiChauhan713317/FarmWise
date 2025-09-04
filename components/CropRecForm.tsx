import getCropRecommendation from "@/app/api/cropRec"; 
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CropRecForm() {
  const [nitrogen, setNitrogen] = useState<string>("");
  const [phosphorus, setPhosphorus] = useState<string>("");
  const [potassium, setPotassium] = useState<string>("");
  const [ph, setPh] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [rainfall, setRainfall] = useState<string>("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [cropRecError, setCropRecError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [recommendation, setRecommendation] = useState<string>("");
  
  const validate = () => {
    let newErrors: { [key: string]: string } = {};

    if (!nitrogen || isNaN(Number(nitrogen)) || Number(nitrogen) < 0) {
      newErrors.nitrogen = "Please enter a valid Nitrogen value";
    }
    if (!phosphorus || isNaN(Number(phosphorus)) || Number(phosphorus) < 0) {
      newErrors.phosphorus = "Please enter a valid Phosphorus value";
    }
    if (!potassium || isNaN(Number(potassium)) || Number(potassium) < 0) {
      newErrors.potassium = "Please enter a valid Potassium value";
    }
    if (!ph || isNaN(Number(ph)) || Number(ph) < 0 || Number(ph) > 14) {
      newErrors.ph = "Soil pH must be between 0 and 14";
    }
    if (!ph || isNaN(Number(rainfall)) || Number(rainfall) < 0) {
      newErrors.potassium = "Please enter a valid rainfall value";
    }
    if (!ph || isNaN(Number(humidity)) || Number(humidity) < 0) {
      newErrors.potassium = "Please enter a valid humidity value";
    }
    if (!ph || isNaN(Number(temperature)) || Number(temperature) < 0) {
      newErrors.potassium = "Please enter a valid temperature value";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  setLoading(true);
  setCropRecError("");

  if (!validate()) {
    setLoading(false); 
    return;
  }

  const formData = {
    N: Number(nitrogen),
    P: Number(phosphorus),
    K: Number(potassium),
    temperature: Number(temperature),
    humidity: Number(humidity),
    ph: Number(ph),
    rainfall: Number(rainfall),
  };

  console.log("Form Data:", formData);

  try {
    const rec = await getCropRecommendation(formData);

    console.log("rec:: ", rec)

    if (rec) {
      setRecommendation(rec);
    } else {
      setCropRecError("No recommendation received from server");
    }
  } catch (err) {
    setCropRecError("Failed to fetch crop recommendation");
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Soil & Crop Details</Text>

      <Text style={styles.label}>🌱 Nitrogen (N)</Text>
      <TextInput
        style={[styles.input, errors.nitrogen && styles.inputError]}
        keyboardType="numeric"
        value={nitrogen}
        onChangeText={setNitrogen}
        placeholder="Enter Nitrogen value"
      />
      {errors.nitrogen && <Text style={styles.error}>{errors.nitrogen}</Text>}

      <Text style={styles.label}>🌱 Phosphorus (P)</Text>
      <TextInput
        style={[styles.input, errors.phosphorus && styles.inputError]}
        keyboardType="numeric"
        value={phosphorus}
        onChangeText={setPhosphorus}
        placeholder="Enter Phosphorus value"
      />
      {errors.phosphorus && <Text style={styles.error}>{errors.phosphorus}</Text>}

      <Text style={styles.label}>🌱 Potassium (K)</Text>
      <TextInput
        style={[styles.input, errors.potassium && styles.inputError]}
        keyboardType="numeric"
        value={potassium}
        onChangeText={setPotassium}
        placeholder="Enter Potassium value"
      />
      {errors.potassium && <Text style={styles.error}>{errors.potassium}</Text>}

      <Text style={styles.label}>🧪 Soil pH</Text>
      <TextInput
        style={[styles.input, errors.ph && styles.inputError]}
        keyboardType="decimal-pad"
        value={ph}
        onChangeText={setPh}
        placeholder="Enter soil pH"
      />
      {errors.ph && <Text style={styles.error}>{errors.ph}</Text>}

      <Text style={styles.label}>Rainfall</Text>
      <TextInput
        style={[styles.input, errors.ph && styles.inputError]}
        keyboardType="decimal-pad"
        value={rainfall}
        onChangeText={setRainfall}
        placeholder="Enter rainfall"
      />
      {errors.rainfall && <Text style={styles.error}>{errors.rainfall}</Text>}

      <Text style={styles.label}>Temperature</Text>
      <TextInput
        style={[styles.input, errors.ph && styles.inputError]}
        keyboardType="decimal-pad"
        value={temperature}
        onChangeText={setTemperature}
        placeholder="Enter temperature"
      />
      {errors.temperature && <Text style={styles.error}>{errors.temperature}</Text>}

      <Text style={styles.label}>Humidity</Text>
      <TextInput
        style={[styles.input, errors.ph && styles.inputError]}
        keyboardType="decimal-pad"
        value={humidity}
        onChangeText={setHumidity}
        placeholder="Enter humidity"
      />
      {errors.humidity && <Text style={styles.error}>{errors.humidity}</Text>}

      <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Submitting..." : "Submit Details"}
            </Text>
      </TouchableOpacity>

      {cropRecError && <Text style={{ color: "red", marginTop: 10 }}>{cropRecError}</Text>}
      {recommendation && (
        <Text style={{ marginTop: 15, fontWeight: "bold", fontSize: 16 }}>
          🌾 Recommended Crop: {recommendation}
        </Text>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f6fff6",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2e7d32",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#dc2626", // red border
  },
  error: {
    color: "#dc2626",
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
  backgroundColor: "#2e7d32",   // nice green
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 15,
},
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
