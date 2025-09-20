import getCropRecommendation from "@/app/api/cropRec";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import { AppButton } from "./AppButton";
import { AppText } from "./AppText";

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
    const cropRecommender = getCropRecommendation();
    const rec = await cropRecommender.fetchRecommendation(formData);

    console.log("rec:: ", rec);

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

      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-xs" className="mb-1">
              🌱 Nitrogen (N)
            </AppText>
            <TextInput
              style={[styles.input, errors.nitrogen && styles.inputError]}
              keyboardType="numeric"
              value={nitrogen}
              onChangeText={setNitrogen}
              placeholder="N value"
            />
            {errors.nitrogen && <AppText colorClassName="text-red-600" sizeClassName="text-xs" className="mt-1">{errors.nitrogen}</AppText>}
          </View>
          <View style={styles.gridItem}>
            <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-xs" className="mb-1">
              🌱 Phosphorus (P)
            </AppText>
            <TextInput
              style={[styles.input, errors.phosphorus && styles.inputError]}
              keyboardType="numeric"
              value={phosphorus}
              onChangeText={setPhosphorus}
              placeholder="P value"
            />
            {errors.phosphorus && <AppText colorClassName="text-red-600" sizeClassName="text-xs" className="mt-1">{errors.phosphorus}</AppText>}
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-xs" className="mb-1">
              🌱 Potassium (K)
            </AppText>
            <TextInput
              style={[styles.input, errors.potassium && styles.inputError]}
              keyboardType="numeric"
              value={potassium}
              onChangeText={setPotassium}
              placeholder="K value"
            />
            {errors.potassium && <AppText colorClassName="text-red-600" sizeClassName="text-xs" className="mt-1">{errors.potassium}</AppText>}
          </View>
          <View style={styles.gridItem}>
            <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-xs" className="mb-1">
              🧪 Soil pH
            </AppText>
            <TextInput
              style={[styles.input, errors.ph && styles.inputError]}
              keyboardType="decimal-pad"
              value={ph}
              onChangeText={setPh}
              placeholder="pH value"
            />
            {errors.ph && <AppText colorClassName="text-red-600" sizeClassName="text-xs" className="mt-1">{errors.ph}</AppText>}
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.gridItem}>
            <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-xs" className="mb-1">
              🌧️ Rainfall
            </AppText>
            <TextInput
              style={[styles.input, errors.rainfall && styles.inputError]}
              keyboardType="decimal-pad"
              value={rainfall}
              onChangeText={setRainfall}
              placeholder="mm"
            />
            {errors.rainfall && <AppText colorClassName="text-red-600" sizeClassName="text-xs" className="mt-1">{errors.rainfall}</AppText>}
          </View>
          <View style={styles.gridItem}>
            <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-xs" className="mb-1">
              🌡️ Temperature
            </AppText>
            <TextInput
              style={[styles.input, errors.temperature && styles.inputError]}
              keyboardType="decimal-pad"
              value={temperature}
              onChangeText={setTemperature}
              placeholder="°C"
            />
            {errors.temperature && <AppText colorClassName="text-red-600" sizeClassName="text-xs" className="mt-1">{errors.temperature}</AppText>}
          </View>
        </View>

        <View style={styles.gridRowLast}>
          <View style={styles.centeredItem}>
            <AppText weight="bold" colorClassName="text-foreground" sizeClassName="text-xs" className="mb-1 text-center">
              💧 Humidity
            </AppText>
            <TextInput
              style={[styles.input, errors.humidity && styles.inputError, styles.centeredInput]}
              keyboardType="decimal-pad"
              value={humidity}
              onChangeText={setHumidity}
              placeholder="Humidity %"
            />
            {errors.humidity && <AppText colorClassName="text-red-600" sizeClassName="text-xs" className="mt-1 text-center">{errors.humidity}</AppText>}
          </View>
        </View>
      </View>

      <AppButton
        title={loading ? "Fetching..." : "Get Crop Recommendation"}
        onPress={handleSubmit}
        disabled={loading}
        className="mt-4"
      />

      {cropRecError && <AppText colorClassName="text-red-600" className="mt-3">{cropRecError}</AppText>}
      {recommendation && (
        <AppText weight="bold" colorClassName="text-primary" sizeClassName="text-lg" className="mt-4">
          🌾 Recommended Crop: {recommendation}
        </AppText>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  gridContainer: {
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  gridRowLast: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center",
  },
  gridItem: {
    flex: 1,
    marginRight: 8,
  },
  centeredItem: {
    alignItems: "center",
    width: "50%",
  },
  centeredInput: {
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 12,
    fontFamily: "SpaceMono",
  },
  inputError: {
    borderColor: "#DC2626",
  },
});
