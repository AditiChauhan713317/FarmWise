import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { analyzePest, PestAnalysisResponse } from "../app/api/pestDetection";

export default function PhotoUploader() {
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<PestAnalysisResponse | null>(null);

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

      try {
        const data = await analyzePest({
          uri,
          type: "image/jpeg",
          name: "photo.jpg",
        });
        setResult(data);
        console.log("API response:", data);
      } catch (error) {
        console.error("Error fetching pest analysis:", error);
      }
    }
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

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Prediction</Text>
          <Text style={styles.resultValue}>{result.prediction}</Text>

          <Text style={styles.resultLabel}>Confidence</Text>
          <Text style={styles.resultValue}>
            {result.confidence }
          </Text>
        </View>
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
});