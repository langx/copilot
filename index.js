import { handleInteraction } from "./copilot/aiHandler.js";

export default async function ({ req, res, log, error }) {
  try {
    // Log a message
    log("Function is running");

    // Parse req.body from a stringified JSON to an object
    const requestBody = JSON.parse(req.body);
    log(`req.body: ${req.body}`);

    // Log some data from the request body
    if (requestBody) {
      log(`Received data: ${JSON.stringify(requestBody)}`);
      log(`req: ${JSON.stringify(req)}`);

      // Check if requestBody.message exists
      if (requestBody.message) {
        log(`requestBody.message: ${requestBody.message}`);
        const userMessage = requestBody.message;
        const aiResponse = await handleInteraction(userMessage);
        log(`res: ${res.json}`);
        return res.json({ response: aiResponse });
      } else {
        log("requestBody.message is undefined");
        return res.send("Invalid request body", 400);
      }
    } else {
      log("requestBody is undefined");
      return res.send("Invalid request body", 400);
    }
  } catch (err) {
    // Log any errors
    error(err.message);
    return res.send("An error occurred", 500);
  }
}
