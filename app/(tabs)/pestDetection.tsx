import PhotoUploader from "@/components/PhotoUploader";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FarmAdvice() {
  const [showHowItWorks, setShowHowItWorks] = useState(true);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-5 py-6"
      >
        <View className="mb-6">
          <View className="mb-2 self-start rounded-full bg-gradient-to-r from-lime-200 to-cyan-100 px-3 py-1">
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-2 rounded-full bg-lime-700" />
              <Text className="text-[11px] font-semibold text-lime-800">AI Powered</Text>
            </View>
          </View>
          <Text className="text-3xl font-extrabold text-black">Detect Pests</Text>
          <Text className="mt-1 text-base text-gray-600">
            Upload a clear photo and get instant AI insights.
          </Text>
        </View>

        <View className="relative overflow-hidden ">
          <PhotoUploader />
        </View>

        <View className="rounded-2xl border border-lime-200 bg-white p-4 shadow-sm">
          <Pressable className="flex-row items-center justify-between" onPress={() => setShowHowItWorks(v => !v)}>
            <Text className="font-semibold text-lime-800">How it works</Text>
            <Text className="text-lime-700">{showHowItWorks ? "▼" : "▶"}</Text>
          </Pressable>
          {showHowItWorks && (
            <View className="mt-3 gap-2">
              <View className="flex-row items-start gap-3">
                <View className="mt-1 h-2 w-2 rounded-full bg-lime-600" />
                <Text className="flex-1 text-gray-700">Upload a photo of the affected crop area.</Text>
              </View>
              <View className="flex-row items-start gap-3">
                <View className="mt-1 h-2 w-2 rounded-full bg-lime-600" />
                <Text className="flex-1 text-gray-700">Our model analyzes visible symptoms and patterns.</Text>
              </View>
              <View className="flex-row items-start gap-3">
                <View className="mt-1 h-2 w-2 rounded-full bg-lime-600" />
                <Text className="flex-1 text-gray-700">Get likely pest matches and next-step suggestions.</Text>
              </View>
            </View>
          )}
        </View>

        <View className="mt-6 rounded-2xl border border-lime-200 bg-lime-50 p-4">
          <Text className="font-semibold text-lime-700">Tips for best results</Text>
          <View className="mt-2">
            <Text className="mb-1 text-gray-700">• Use good natural lighting</Text>
            <Text className="mb-1 text-gray-700">• Focus on the affected leaf/area</Text>
            <Text className="text-gray-700">• Keep the image steady and unblurred</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
