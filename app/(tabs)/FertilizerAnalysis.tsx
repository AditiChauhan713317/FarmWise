import FertilizerAnalyser from "@/components/FertilizerAnalyser";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

export default function FertilizerAnalysis() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
      contentContainerStyle={{paddingHorizontal: 10}}
      showsVerticalScrollIndicator={false}
      >
        <FertilizerAnalyser />
        
      </ScrollView>
    </SafeAreaView>
  );
}
