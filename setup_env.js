import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { systemInstruction, chatHistory } from "./instructions.js";

// Function to safely escape and format strings for environment variables
const escapeStringForEnv = (str) => {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/"/g, '\\"');
};

// Function to read the existing .env file content
const readEnvFile = (filePath) => {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
};

// Function to write data to the .env file
const writeEnvFile = (filePath, content) => {
  fs.writeFileSync(filePath, content, "utf8");
};

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your .env file
const envFilePath = path.join(__dirname, ".env");

// Read the existing .env file content
let envContent = readEnvFile(envFilePath);

// Convert the instructions to environment variable format
const systemInstructionValue = escapeStringForEnv(systemInstruction);
const chatHistoryValue = JSON.stringify(chatHistory);

// Update or append the environment variables in the .env file content
const updateEnvContent = (content, key, value) => {
  const regex = new RegExp(`^${key}=.*`, "m");
  const newLine = `${key}='${value}'`;
  console.log("regex:", regex);
  console.log("newLine:", newLine);
  if (content.match(regex)) {
    return content.replace(regex, newLine);
  } else {
    return content + newLine + "\n";
  }
};

envContent = updateEnvContent(
  envContent,
  "SYSTEM_INSTRUCTION",
  systemInstructionValue
);
envContent = updateEnvContent(envContent, "CHAT_HISTORY", chatHistoryValue);

// Write the updated content back to the .env file
writeEnvFile(envFilePath, envContent);

console.log("Environment variables saved successfully.");
