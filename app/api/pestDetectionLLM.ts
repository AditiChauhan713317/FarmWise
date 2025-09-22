import Constants from "expo-constants";

const openRouterApiKey = Constants.expoConfig?.extra?.openRouterApiKey;

export const pestExplanation = async (
  detectedPest: string,
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
                You are a friendly agricultural advisor. A farmer has detected a pest in their field. 
                Explain what this pest is in simple, friendly words, why it harms their crop, and give clear, practical steps the farmer can take immediately. 
                Include concrete actions like how to spray, how much to use, or simple remedies. 
                Keep it short, direct, and easy for a farmer to follow. 
                Respond ONLY in this JSON format:

                {
                    "pest": "...",
                    "harm": "...",
                    "action": "..."
                }

                Respond in ${supportedLang === "hi" ? "Hindi" : "English"}.
                `
            },
            {
            role: "user",
            content: `
                Pest detected: ${detectedPest}
                Based on this, what should the farmer do now?
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
    return "Error analyzing pest";
  }
};