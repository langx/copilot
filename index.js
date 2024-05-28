import { handleInteraction } from "./copilot/aiHandler.js";

export default async function ({ req, res, log, error }) {
  try {
    // Log a message
    log("Function is running");

    // Log some data from the request body
    if (req.body) {
      log(`Received data: ${JSON.stringify(req.body)}`);
      log(`req: ${req}`);

      // Check if req.body.message exists
      if (req.body.message) {
        log(`req.body.message: ${req.body.message}`);
        const userMessage = req.body.message;
        const aiResponse = await handleInteraction(userMessage);
        log(`res: ${res.json}`);
        return res.json({ response: aiResponse });
      } else {
        log("req.body.message is undefined");
        return res.send("Invalid request body", 400);
      }
    } else {
      log("req.body is undefined");
      return res.send("Invalid request body", 400);
    }
  } catch (err) {
    // Log any errors
    error(err.message);
    return res.send("An error occurred", 500);
  }
}
