import fs from "fs";
import { systemInstruction, chatHistory } from "./instructions.js";

const envFilePath = new URL(".env", import.meta.url);
let envContent = "";

try {
  // Read the existing .env file content
  envContent = fs.readFileSync(envFilePath, "utf8");
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

// Convert the instructions to an environment variable format
const systemInstructionValue = systemInstruction
  .replace(/'/g, "\\'")
  .replace(/\n/g, "\\n");
const chatHistoryValue = JSON.stringify(chatHistory)
  .replace(/'/g, "\\'")
  .replace(/\n/g, "\\n");

const systemInstructionEnv = `SYSTEM_INSTRUCTION='${systemInstructionValue}'`;
const chatHistoryEnv = `CHAT_HISTORY='${chatHistoryValue}'`;

// Function to update or add environment variable in .env content
const updateEnvVariable = (content, variable, value) => {
  const regex = new RegExp(`^${variable}=.*$`, "m");
  if (regex.test(content)) {
    return content.replace(regex, value);
  } else {
    return content + "\n" + value;
  }
};

// Update or append the variables
envContent = updateEnvVariable(
  envContent,
  "SYSTEM_INSTRUCTION",
  systemInstructionEnv
);
envContent = updateEnvVariable(envContent, "CHAT_HISTORY", chatHistoryEnv);

// Write the updated .env file
fs.writeFileSync(envFilePath, envContent, { flag: "w" });
