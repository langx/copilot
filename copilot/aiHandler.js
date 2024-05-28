import { genAI, safetySettings } from "../utils/common.js";
import { systemInstruction, chatHistory } from "../utils/instructions.js";

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
