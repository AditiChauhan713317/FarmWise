import Constants from "expo-constants";

const openRouterApiKey = Constants.expoConfig?.extra?.openRouterApiKey;

export const cropRecExplanation = async (
  recommendedCrop: string,
  nitrogen: string,
  phosphorus: string,
  potassium: string,
  temperature: string,
  rainfall: string,
  humidity: string,
  ph: string,
  supportedLang: string | undefined
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
            content: `
                You are a friendly agricultural advisor. A crop has been recommended to a farmer. 
                Explain in simple, friendly words **why this crop is suitable** based on the provided soil and weather conditions. 
                Include key factors like soil nutrients (N, P, K), pH, temperature, humidity, and rainfall. 
                Keep the explanation short, direct, and easy for a farmer to understand. 
                Respond ONLY in this JSON format:

                {
                "crop": "...",
                "reason": "..."
                }

                Respond in ${supportedLang === "hi" ? "Hindi" : "English"}.
            `
            },
            {
            role: "user",
            content: `
                Recommended crop: ${recommendedCrop}
                
                Soil and weather context:
                Nitrogen: ${nitrogen}
                Phosphorus: ${phosphorus}
                Potassium: ${potassium}
                pH: ${ph}
                Temperature: ${temperature}
                Humidity: ${humidity}
                Rainfall: ${rainfall}

                Explain why this crop is suitable for the farmer now.
            `
            }
        ],
      }),
    });

    const data = await res.json();
    console.log("LLM::: ", data);

    return (
      data?.choices?.[0]?.message?.content?.trim() ||
      "No response from LLM"
    );
  } catch (err) {
    console.error("LLM error:", err);
    return "Error analyzing crop recommendation";
  }
};