import { config } from "dotenv";

import { genAI, safetySettings } from "../utils/common.js";

config();

const systemInstruction = process.env.SYSTEM_INSTRUCTION;
const chatHistory = process.env.CHAT_HISTORY;

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

export async function handleInteraction(userMessage) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: chatHistory,
  });

  const result = await chatSession.sendMessage(userMessage);
  return JSON.parse(result.response.text());
}
