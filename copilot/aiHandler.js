import dotenv from "dotenv";

import { genAI, safetySettings } from "../utils/common.js";

dotenv.config();

const systemInstruction = decodeURIComponent(process.env.SYSTEM_INSTRUCTION);
const chatHistory = JSON.parse(process.env.CHAT_HISTORY) || [];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  systemInstruction: systemInstruction,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 512,
  responseMimeType: "application/json",
};

async function handleInteraction(userMessage) {
  try {
    if (
      !userMessage ||
      typeof userMessage !== "string" ||
      userMessage.trim() === ""
    ) {
      console.error("Invalid user message:", userMessage);
      throw new Error("Invalid user message");
    }

    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: chatHistory,
    });

    // Send user message
    const result = await chatSession.sendMessage(userMessage);
    if (!result || !result.response) {
      console.error("Invalid response from generative model:", result);
      throw new Error("Invalid response from generative model");
    }

    // Return the corrected message
    return result.response;
  } catch (error) {
    console.error("Error in handleInteraction:", error);
    throw error;
  }
}

export { handleInteraction };
