import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { handleInteraction } from "../copilot/aiHandler.js";

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

      const response = await handleInteraction(userMessage);

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
