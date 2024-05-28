import { handleInteraction } from "./copilot/aiHandler.js";
import { throwIfMissing } from "./utils/utils.js";

export default async function ({ req, res, log, error }) {
  try {
    // Log a message
    log("Function is running");
    log(`req: ${JSON.stringify(req)}`);

    // Log some data from the request body
    if (req.body) {
      log(`Received data: ${req.body}`);
    }

    // Check the request method
    if (req.method === "GET") {
      // Send a JSON response
      log(`res: ${res}`);
      return res.json({ message: "Hello, World!" });
    } else if (req.method === "POST") {
      throwIfMissing(JSON.parse(req.body), ["message"]);
      throwIfMissing(req.headers, ["x-appwrite-user-id"]);
      // Handle POST request
      // log(`req.body: ${JSON.parse(req.body)}`);
      // log(`req.headers: ${req.headers["x-appwrite-user-id"]}`);

      //TODO:  Check user has early-adopter badge or not!

      const userMessage = JSON.parse(req.body).message;
      log(`userMessage: ${userMessage}`);
      log(`userId: ${req.headers["x-appwrite-user-id"]}`);

      const aiResponse = await handleInteraction(userMessage);
      return res.json({ response: aiResponse });
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
