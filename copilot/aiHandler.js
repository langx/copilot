import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Verify that the environment variable is loaded correctly
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "The OPENAI_API_KEY environment variable is missing or empty."
  );
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistant_id = process.env.OPENAI_ASSISTANT_ID;

async function handleInteraction(userMessage) {
  return new Promise(async (resolve, reject) => {
    try {
      // Create the thread
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      });

      if (!thread || !thread.id) {
        throw new Error("Thread creation failed");
      }

      console.log("Thread created:", thread);

      let output = "";

      openai.beta.threads.runs
        .stream(thread.id, {
          assistant_id: assistant_id,
        })
        .on("textDelta", (textDelta) => {
          output += textDelta.value;
        })
        .on("end", async () => {
          console.log(output);

          // Delete Thread
          const response = await openai.beta.threads.del(thread.id);
          if (response.deleted) {
            console.log("Thread deleted");
          }
          // You can now use the 'output' variable for further processing
          resolve(output);
        });
    } catch (error) {
      console.error("Error creating thread or run:", error);
      reject(error);
    }
  });
}

export { handleInteraction };
