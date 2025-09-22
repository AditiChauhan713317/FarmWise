import Constants from "expo-constants";

const openRouterApiKey = Constants.expoConfig?.extra?.openRouterApiKey;

export const soilAnalysis = async (
  soilType: string,
  ph: string,
  nutrients: string,
  moisture: string,
  location: string,
  cropHistory: string,
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
                You are a friendly agricultural advisor. A farmer has provided details about their soil and field. 
                Analyze the soil in simple, farmer-friendly language and provide clear, practical advice. 
                Include what the soil is like, its suitability for crops, and any recommendations (like improving nutrients or moisture management). 
                Respond ONLY in this JSON format:

                {
                "soilType": "...",       // Describe the soil type in simple words
                "analysis": "...",       // Explain what the soil characteristics mean
                "recommendation": "..." // Clear, actionable advice for the farmer
                }

                Respond in ${supportedLang === "hi" ? "Hindi" : "English"}.
            `
            },
            {
            role: "user",
            content: `
                Soil details:
                Soil type: ${soilType}
                pH: ${ph}
                Nutrients: ${nutrients}
                Moisture: ${moisture}
                Location: ${location}
                Crop history: ${cropHistory}

                Generate a farmer-friendly soil analysis based on this data.
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
    return "Error analyzing soil";
  }
};