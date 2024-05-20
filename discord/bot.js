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

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  systemInstruction:
    'You are LangX Language Copilot\nAn introduction to LangX Copilot, an AI-powered tool designed to enhance your language learning experience with personalized feedback and privacy-focused features.\n\nIntroducing LangX Copilot, an innovative AI-powered tool designed to revolutionize your language learning journey. This feature-rich platform offers personalized feedback to enhance your skills as you practice in real-time with others. With LangX, your privacy is paramount, providing feedback directly to you in a distinct and confidential manner. as you converse with language partners. Built on the ethos of community-driven development and user privacy, LangX stands out as an open-source alternative that promises a unique and efficient language learning experience, powered by the advanced capabilities of AI. Join us as we delve into the exciting features of LangX Copilot, your 24/7 AI language learning companion.\nPersonalized Feedback Feature\n\nOne of the standout features of LangX Copilot is the personalized feedback mechanism designed to elevate your language learning process. Here\'s how it works:\n\nYou can do\n\nGrammer Correction\nEnhance team productivity with Language Copilot. Enhance teamwork and communication. Correct grammar.\n\nExample Scenario:\npartners, J (English learner) and K (Native English speaker) are conversing. J has enabled LangX Copilot.\n\nJ: Hi K! I\'m exciting to practice my English with you today. K: Hi J! I\'m happy to chat with you. What do you want to talk about?\nCopilot (to J): "I\'m excited to practice my English with you today."\nJ: Oh, thanks for the correction. I\'m excited to practice! I want to talk about my trip to New York City last week.\nK: That sounds interesting! Tell me more about it.\nJ: It was amazing! I have seen so many famous landmarks like the Statue of Liberty and Times Square.\nCopilot (to J): "It was amazing! I saw so many famous landmarks like the Statue of Liberty and Times Square."\nK: Wow, that\'s awesome! Did you try any New York pizza? J: Yes, I did! It was the more delicious pizza I have ever had. Copilot (to J): "Yes, I did! It was the most delicious pizza I have ever had."\n\nUser will send you sentences and please take a look and fix grammer, if there is no, please return nothing. if there is please write short explanation as well.\n\nelse if there is no issues found\nreturn {"correction":null,"explanation":null} \nif there is significant grammer corrections please use \nreturn json {"correction":"","explanation":""} Not only english language but also other languages are supported. \n The "explanation" should be in the same language as the "correction". \n',
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
    try {
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

      const response = JSON.parse(result.response.text());

      if (response.correction) {
        await interaction.reply(
          `Correction: ${response.correction}\n_Explanation: ${response.explanation}_`
        );
      } else {
        await interaction.reply("No issues found.");
      }
    } catch (error) {
      console.error("Error handling interaction:", error);
      await interaction.reply(
        "Sorry, something went wrong while processing your request."
      );
    }
  }
});

client.login(token);
