import { handleInteraction } from "./copilot/aiHandler.js";

export default async function ({ req, res, log, error }) {
  try {
    // Log a message
    log("Function is running");

    // Log some data from the request body
    if (req.body) {
      log(`Received data: ${JSON.stringify(req.body)}`);
    }

    // Check the request method
    if (req.method === "GET") {
      // Send a JSON response
      return res.json({ message: "Hello, World!" });
    } else if (req.method === "POST") {
      // Handle POST request
      const userMessage = req.body.message;
      const aiResponse = await handleInteraction(userMessage);
      return res.json({ response: aiResponse });
    } else {
      // Handle other HTTP methods if necessary
      return res.send("Unsupported request method", 405);
    }
  } catch (err) {
    // Log any errors
    error(err.message);
    return res.send("An error occurred", 500);
  }
}
