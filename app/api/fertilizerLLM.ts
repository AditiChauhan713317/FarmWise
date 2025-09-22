// import Constants from "expo-constants";
// const openRouterApiKey = Constants.expoConfig?.extra?.openRouterApiKey;

// export const analyzeFertilizer = async (ocrText: string): Promise<string> => {
//   try {
//     const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${openRouterApiKey}`, 
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "deepseek/deepseek-chat-v3.1:free", 
//         messages: [
//           {
//             role: "system",
//             content: "You are an agricultural assistant. Analyze fertilizer packaging text and provide clear, practical advice for farmers based on their farm needs."
//           },
//           {
//             role: "user",
//             content: `Here is the extracted fertilizer packaging text:\n\n${ocrText}\n\nShould I buy this fertilizer for a typical farm? Provide a short advisory.`
//           }
//         ],
//       }),
//     });

//     const data = await res.json();
//     console.log("LLM::: ", data);

//     return data?.choices?.[0]?.message?.content?.trim() || "No response from LLM";
//   } catch (err) {
//     console.error("LLM error:", err);
//     return "Error analyzing fertilizer";
//   }
// };




import Constants from "expo-constants";

const openRouterApiKey = Constants.expoConfig?.extra?.openRouterApiKey;

export const analyzeFertilizer = async (
  ocrText: string,
  context: {
    crop: string;
    stage: string;
  },
  supportedLang: string | undefined
): Promise<string> => {
  try {

    // console.log("INSIDE LLM CALL SUPPORTED LANG::: ", supportedLang)
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "system",
            content: `
              You are a friendly agricultural advisor. Analyze fertilizer packaging text and provide practical advice for farmers. 
              Explain clearly whether this fertilizer is suitable for the given crop and stage, and provide actionable instructions in a farmer-friendly tone.
              Your response must be short, clear, and in this JSON format:

              {
                "useFertilizer": "...",        // Yes/No
                "reason": "...",               // Simple explanation for the recommendation
                "dosage": "...",               // How much fertilizer to use
                "frequency": "...",            // How often to apply
                "method": "..."                // How to apply (e.g., foliar spray, soil mixing)
              }

              Respond in ${supportedLang === "hi" ? "Hindi" : "English"}.
            `
          },
          {
            role: "user",
            content: `
              Fertilizer packaging text:\n${ocrText}\n
              Farm context:\nCrop: ${context.crop}\nStage: ${context.stage}\n
              Based on this, what should the farmer do?
            `
          }

        ],
      }),
    });

    const data = await res.json();
    // console.log("LLM::: ", data);

    return (
      data?.choices?.[0]?.message?.content?.trim() ||
      "No response from LLM"
    );
  } catch (err) {
    console.error("LLM error:", err);
    return "Error analyzing fertilizer";
  }
};
