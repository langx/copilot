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
      log(`res: ${res}`);
      return res.json({ message: "Hello, World!" });
    } else if (req.method === "POST") {
      // Handle POST request
      log(`req.body: ${req}`);
      log(typeof req);
      log(typeof req.body);
      // log(`req.body: ${JSON.parse(req.body)}`);
      // log(`req.body.message: ${JSON.parse(req.body.message)}`);
      // const userMessage = JSON.parse(req.body).message;
      // const aiResponse = await handleInteraction(userMessage);
      // log(`res: ${res.json}`);
      // return res.json({ response: aiResponse });
      return res.json({ message: "Hello, World!" });
    } else {
      // Handle other HTTP methods if necessary
      log(`res: ${res.json}`);
      return res.send("Unsupported request method", 405);
    }
  } catch (err) {
    // Log any errors
    error(err.message);
    return res.send("An error occurred", 500);
  }
}
