import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import _ from "lodash";
import { fileURLToPath } from "url";

import { systemInstruction, chatHistory } from "./instructions.js";

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
const systemInstructionValue = encodeURI(systemInstruction);
const chatHistoryValue = JSON.stringify(chatHistory);

// Update or append the environment variables in the.env file content
const updateEnvContent = (content, key, value) => {
  const regex = new RegExp(`^${key}=.*`, "m");
  const newLine = `${key}='${value}'`;
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

//
// TESTS
//

// Load environment variables from.env file
dotenv.config();

// Get the value of SYSTEM_INSTRUCTION from.env file
const systemInstructionFromEnv = decodeURIComponent(
  process.env.SYSTEM_INSTRUCTION
);

// Compare the value with the variable you wrote
if (systemInstructionFromEnv === systemInstruction) {
  console.log("PASSED: systemInstruction: The values are equal.");
} else {
  console.log("FAILED: systemInstruction: The values are not equal.");
}

// Get the value of CHAT_HISTORY from .env file
const chatHistoryFromEnv = JSON.parse(process.env.CHAT_HISTORY);

// Compare the value with the variable you wrote
if (_.isEqual(chatHistoryFromEnv, chatHistory)) {
  console.log("PASSED: chatHistory: The values are equal.");
} else {
  console.log("FAILED: chatHistory: The values are not equal.");
}
