import PhotoUploader from "@/components/PhotoUploader";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

export default function FarmAdvice() {
  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-5 py-6"
      >
        <PhotoUploader />
        
      </ScrollView>
    </SafeAreaView>
  );
}
