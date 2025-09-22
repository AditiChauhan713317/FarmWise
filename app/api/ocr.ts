// import Constants from "expo-constants";
// // const openRouterApiKey = Constants.expoConfig?.extra?.openRouterApiKey;

// import * as ImageManipulator from "expo-image-manipulator";

// // Preprocess image (resize + compress + base64)
// export const preprocessImage = async (uri: string) => {
//   const manipulated = await ImageManipulator.manipulateAsync(
//     uri,
//     [{ resize: { width: 1000 } }],
//     { compress: 0.7, format: ImageManipulator.SaveFormat.PNG, base64: true }
//   );

//   return manipulated;
// };

// // Send to OCR.space API
// export const sendToOCR = async (base64: string): Promise<string> => {
//   try {

//     const ocrApiKey = Constants.expoConfig?.extra?.ocrApiKey;

//     const formData = new FormData();
//     formData.append("base64Image", `data:image/png;base64,${base64}`);
//     formData.append("language", "eng");
//     formData.append("isOverlayRequired", "false");
//     formData.append("scale", "true");
//     formData.append("OCREngine", "2");

//     const res = await fetch("https://api.ocr.space/parse/image", {
//       method: "POST",
//       headers: {
//         apikey: ocrApiKey, 
//       },
//       body: formData,
//     });

//     const data = await res.json();
//     // console.log("OCR::: ", data);

//     return data?.ParsedResults?.[0]?.ParsedText?.trim() || "No text found";
//   } catch (err) {
//     console.error("OCR error:", err);
//     return "Error reading text";
//   }
// };


import Constants from "expo-constants";
import * as ImageManipulator from "expo-image-manipulator";

// Preprocess image (resize + compress + base64)
export const preprocessImage = async (uri: string) => {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1000 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.PNG, base64: true }
  );

  return manipulated;
};

// Send to OCR.space API
export const sendToOCR = async (base64: string): Promise<string | null> => {
  try {
    const ocrApiKey = Constants.expoConfig?.extra?.ocrApiKey;

    console.log("ocr apiKey: ", ocrApiKey)

    const formData = new FormData();
    formData.append("base64Image", `data:image/png;base64,${base64}`);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");
    formData.append("scale", "true");
    formData.append("OCREngine", "2");

    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: { apikey: ocrApiKey },
      body: formData,
    });

    const data = await res.json();

    const text = data?.ParsedResults?.[0]?.ParsedText?.trim();

    // If no text found, return null
    if (!text || text.length === 0) {
      return null;
    }

    return text;
  } catch (err) {
    console.error("OCR error:", err);
    return null; // signal failure
  }
};
