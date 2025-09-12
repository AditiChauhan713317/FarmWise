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
  }
): Promise<string> => {
  try {
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
            content:
              "You are an agricultural assistant. Analyze fertilizer packaging text and provide clear, practical advice for farmers. Your response must be short, direct, and in this format: YES/NO then give reason then give Dosage/Instructions.",
          },
          {
            role: "user",
            content: `Fertilizer packaging text:\n${ocrText}\n\nFarm context:\nCrop: ${context.crop}\nStage: ${context.stage}\n\nBased on this, should the farmer use this fertilizer?`,
          },
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
