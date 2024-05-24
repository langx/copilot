import { Client, GatewayIntentBits } from "discord.js";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { config } from "dotenv";

import { genAI } from "../utils/common.js";

config(); // Load environment variables from .env file

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.DISCORD_BOT_TOKEN;
const maxCharSize = 500;

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  systemInstruction: `
    You are LangX Language Copilot. An introduction to LangX Copilot, an AI-powered tool designed to enhance your language learning experience with personalized feedback and privacy-focused features.
    
    Introducing LangX Copilot, an innovative AI-powered tool designed to revolutionize your language learning journey. This feature-rich platform offers personalized feedback to enhance your skills as you practice in real-time with others. With LangX, your privacy is paramount, providing feedback directly to you in a distinct and confidential manner as you converse with language partners. Built on the ethos of community-driven development and user privacy, LangX stands out as an open-source alternative that promises a unique and efficient language learning experience, powered by the advanced capabilities of AI. Join us as we delve into the exciting features of LangX Copilot, your 24/7 AI language learning companion.
    
    Personalized Feedback Feature:
    
    One of the standout features of LangX Copilot is the personalized feedback mechanism designed to elevate your language learning process. Here's how it works:
    
    You can do Grammar Correction and enhance team productivity with Language Copilot. Enhance teamwork and communication. Correct grammar.
    
    Example Scenario:
    Partners, J (English learner) and K (Native English speaker) are conversing. J has enabled LangX Copilot.
    
    J: Hi K! I'm exciting to practice my English with you today.
    K: Hi J! I'm happy to chat with you. What do you want to talk about?
    Copilot (to J): "I'm excited to practice my English with you today."
    J: Oh, thanks for the correction. I'm excited to practice! I want to talk about my trip to New York City last week.
    K: That sounds interesting! Tell me more about it.
    J: It was amazing! I have seen so many famous landmarks like the Statue of Liberty and Times Square.
    Copilot (to J): "It was amazing! I saw so many famous landmarks like the Statue of Liberty and Times Square."
    K: Wow, that's awesome! Did you try any New York pizza?
    J: Yes, I did! It was the more delicious pizza I have ever had.
    Copilot (to J): "Yes, I did! It was the most delicious pizza I have ever had."
    
    Users will send you sentences and you should take a look and fix grammar. If there are no issues, please return nothing. If there are issues, please write a short explanation as well.
    
    If there are no issues found, return {"correction": null, "explanation": null}. 
    If there are significant grammar corrections, return JSON {"correction": "", "explanation": ""}.
    Not only English language but also other languages are supported. 
    The "explanation" should be in the same language as the "correction".
  `,
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

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "fix") {
    const userMessage = options.getString("message");

    if (userMessage.length > maxCharSize) {
      await interaction.reply(
        `❌ Your message is too long! Please keep it under ${maxCharSize} characters.`
      );
      return;
    }

    try {
      // Acknowledge the interaction to avoid timing out
      await interaction.deferReply();

      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [
              {
                text: "Oh, thanks! Yes, I am relaxing at home. What about you? Do you have any plans for today?\n",
              },
            ],
          },
          {
            role: "model",
            parts: [{ text: '{"correction":null,"explanation":null}\n\n' }],
          },
          {
            role: "user",
            parts: [
              {
                text: "Oh, thanks! Yes, I am relaxing at home. What about you? Do you have any plans for todays?",
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: '{"correction":"Oh, thanks! Yes, I am relaxing at home. What about you? Do you have any plans for today?","explanation":"\\"Todays\\" should be \\"today\\"."}\n\n',
              },
            ],
          },
          {
            role: "user",
            parts: [
              {
                text: "That sound nice. I think I will also watch a movie later.",
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: '{"correction":"That sounds nice. I think I will also watch a movie later.","explanation":"\\"Sound\\" should be \\"sounds\\" to agree with the singular subject \\"That\\"."}\n\n',
              },
            ],
          },
          {
            role: "user",
            parts: [
              {
                text: "I'm happy to chat with you. What do you want to talk about it more about?\n",
              },
            ],
          },
          {
            role: "model",
            parts: [
              {
                text: '{"correction":"I\'m happy to chat with you. What do you want to talk about?","explanation":"Remove \\"it more about\\" to avoid redundancy. \\"What do you want to talk about?\\" is sufficient."}\n',
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage(userMessage);

      const response = JSON.parse(result.response.text);

      if (response.correction) {
        await interaction.editReply(
          `📝 **Your message:** ${userMessage}\n✅ **Correction:** ${response.correction}\nℹ️ **Explanation:** ${response.explanation}`
        );
      } else {
        await interaction.editReply(
          `📝 **Your message:** ${userMessage}\n👌 No issues found.`
        );
      }
    } catch (error) {
      console.error("Error handling interaction:", error);
      await interaction.editReply(
        `📝 **Your message:** ${userMessage}\n❌ Sorry, something went wrong while processing your request.`
      );
    }
  }
});

client.login(token);
