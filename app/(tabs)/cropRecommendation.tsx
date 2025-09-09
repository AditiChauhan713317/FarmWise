import { AppText } from "@/components/AppText";
import CropRecForm from "@/components/CropRecForm";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FarmAdvice() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-5 py-6"
      >
        <AppText weight="bold" sizeClassName="text-2xl" colorClassName="text-foreground" className="mb-6">
          Crop Recommendation
        </AppText>
        <CropRecForm />
        
      </ScrollView>
    </SafeAreaView>
  );
}
