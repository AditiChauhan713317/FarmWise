// app/api/chatbot.ts
import * as FileSystem from "expo-file-system";
export interface ChatMessage {
  message: string;
  language: string;
}

export interface ChatResponse {
  reply: string;
  language: string;
}

export interface STTResponse {
  text: string;
}

const BASE_URL = "https://multilingual-chatbot-tsy6.onrender.com";

export async function sendChatMessage(message: string, language: string): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.statusText}`);
  }

  return response.json();
}

export async function speechToText(audioUri: string): Promise<STTResponse> {
  const formData = new FormData();
  formData.append("audio", {
    uri: audioUri,
    type: "audio/mp3",
    name: "audio.mp3",
  } as any);

  const response = await fetch(`${BASE_URL}/voice-to-text`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`STT API error: ${response.statusText}`);
  }

  return response.json();
}

export async function textToSpeech(text: string, language: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/text-to-voice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.statusText}`);
  }

  // Detect content type to decide how to handle the response
  const contentType = response.headers.get("content-type") || "";

  // Case 1: Server returns JSON with an audio URL
  if (contentType.includes("application/json")) {
    const data = await response.json();
    if (data.audioUrl && typeof data.audioUrl === "string") {
      return data.audioUrl;
    }
    throw new Error("Server JSON did not include audioUrl");
  }

  // Case 2: Server returns raw audio (e.g., audio/mpeg, application/octet-stream)
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Convert to base64 for writing to the filesystem in React Native
  let binary = "";
  const chunkSize = 0x8000; // process in chunks to avoid call stack limits
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  const base64 = global.btoa ? global.btoa(binary) : Buffer.from(binary, "binary").toString("base64");

  const extension = contentType.includes("wav") ? "wav" : "mp3";
  const fileUri = `${FileSystem.cacheDirectory}tts-${Date.now()}.${extension}`;
  await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
  return fileUri;
}

// Function to clean markdown symbols from text
export function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
    .replace(/\*(.*?)\*/g, '$1') // Remove italic *text*
    .replace(/`(.*?)`/g, '$1') // Remove code `text`
    .replace(/#{1,6}\s/g, '') // Remove headers # ## ###
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links [text](url)
    .replace(/^\s*[-*+]\s/gm, '• ') // Convert list items to bullet points
    .replace(/^\s*\d+\.\s/gm, '') // Remove numbered lists
    .replace(/\n{3,}/g, '\n\n') // Limit multiple newlines
    .trim();
}

export const SUPPORTED_LANGUAGES = [
  { code: "English", name: "English", flag: "🇺🇸" },
  { code: "Hindi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "Spanish", name: "Español", flag: "🇪🇸" },
  { code: "French", name: "Français", flag: "🇫🇷" },
  { code: "German", name: "Deutsch", flag: "🇩🇪" },
  { code: "Chinese", name: "中文", flag: "🇨🇳" },
  { code: "Japanese", name: "日本語", flag: "🇯🇵" },
  { code: "Arabic", name: "العربية", flag: "🇸🇦" },
];
