import fs from "fs";
import { systemInstruction, chatHistory } from "./utils/instructions.js";

// Convert the instructions to an environment variable format
let envVariable = `\n\nSYSTEM_INSTRUCTION='${systemInstruction
  .replace(/'/g, "\\'")
  .replace(/\n/g, "\\n")}'\nCHAT_HISTORY='${JSON.stringify(chatHistory)
  .replace(/'/g, "\\'")
  .replace(/\n/g, "\\n")}'\n`;

// Write the instructions to the .env file
fs.writeFileSync(new URL(".env", import.meta.url), envVariable, { flag: "a" });
