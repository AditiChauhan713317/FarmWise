export default function parseLLMResponse(response: string) {
  try {
    // Remove backticks or markdown fences if present
    const cleaned = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse LLM JSON:", err);
    return null; // or fallback
  }
}