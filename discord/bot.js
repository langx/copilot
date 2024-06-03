import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { handleInteraction } from "../copilot/aiHandler.js";

config(); // Load environment variables from .env file

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: ["CHANNEL"], // Enable partials for direct messages
});

const token = process.env.DISCORD_BOT_TOKEN;
const maxCharSize = 500;

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  // Restrict the bot from responding to direct messages
  if (!interaction.channel || interaction.channel.type === "DM") {
    await interaction.reply({
      content:
        "❌ This bot does not handle direct messages. Please use commands in a <#1223003189247217758>.",
      allowedMentions: { parse: [] }, // Disable mention parsing to prevent potential security issues
    });
    return;
  }

  if (commandName === "fix") {
    let userMessage = options.getString("message");

    // Input validation and sanitization
    if (typeof userMessage !== "string" || userMessage.trim() === "") {
      await interaction.reply("❌ Please provide a valid message.");
      return;
    }

    userMessage = userMessage.trim();

    if (userMessage.length > maxCharSize) {
      await interaction.reply(
        `❌ Your message is too long! Please keep it under ${maxCharSize} characters.`
      );
      return;
    }

    try {
      // Acknowledge the interaction to avoid timing out
      await interaction.deferReply();

      let response = await handleInteraction(userMessage);
      response = JSON.parse(response.text());

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
