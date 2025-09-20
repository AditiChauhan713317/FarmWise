import { AppText } from "@/components/AppText";
import CropRecForm from "@/components/CropRecForm";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FarmAdvice() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-5 py-6"
      >

        <View className="mb-6">
          <View className="mb-2 self-start rounded-full bg-gradient-to-r from-lime-200 to-cyan-100 px-3 py-1">
            <Text className="text-[11px] font-semibold text-lime-800">Smart Suggestions</Text>
          </View>
          <AppText weight="bold" sizeClassName="text-3xl" colorClassName="text-black">
            Crop Recommendation
          </AppText>
          <Text className="mt-1 text-base text-gray-600">Find the best crops for your soil and season.</Text>
        </View>

        <CropRecForm />

        <View className="mt-6 rounded-2xl border border-lime-200 bg-lime-50 p-4">
          <Text className="font-semibold text-lime-700">Quick Tips</Text>
          <View className="mt-2">
            <Text className="mb-1 text-gray-700">• Keep location turned on for accurate weather.</Text>
            <Text className="mb-1 text-gray-700">• Enter recent soil details if available.</Text>
            <Text className="text-gray-700">• Review market demand before sowing.</Text>
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <Text className="font-semibold text-cyan-700">Weather Alert</Text>
          <Text className="mt-1 text-sm text-gray-600">Check current conditions for optimal planting timing.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

