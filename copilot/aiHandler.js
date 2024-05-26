import dotenv from "dotenv";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import { genAI } from "../utils/common.js";

dotenv.config();

const systemInstruction = process.env.SYSTEM_INSTRUCTION;
const chatHistory = JSON.parse(process.env.CHAT_HISTORY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  systemInstruction: systemInstruction,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function handleInteraction(userMessage) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: chatHistory,
  });

  const result = await chatSession.sendMessage(userMessage);
  return JSON.parse(result.response.text());
}
