import { Client, Databases } from "node-appwrite";

import { handleInteraction } from "./copilot/aiHandler.js";
import { throwIfMissing } from "./utils/utils.js";

export default async function ({ req, res, log, error }) {
  try {
    // Log a message
    log("Function is running");
    // log(`req: ${JSON.stringify(req)}`);

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

      const userMessage = JSON.parse(req.body).message;
      log(`userMessage: ${userMessage}`);
      log(`userId: ${req.headers["x-appwrite-user-id"]}`);

      // Check user has early-adopter badge or not!
      // Init SDK
      const client = new Client()
        .setEndpoint(process.env.APP_ENDPOINT)
        .setProject(process.env.APP_PROJECT)
        .setKey(process.env.API_KEY);
      // .setJWT(req.headers["x-appwrite-user-jwt"]);

      log("Client initialized with endpoint, project, and JWT");

      const db = new Databases(client);

      log("Database initialized with client");

      // Check if lastSeen and name exists
      const userDoc = await db.getDocument(
        process.env.APP_DATABASE,
        process.env.USERS_COLLECTION,
        // req.headers["x-appwrite-user-id"]
        "6655de0d6c9b6aefca3f" // Test user ID with early-adopter badge
      );

      log("Fetched user document");
      // log(userDoc);

      // Check if user has early-adopter badge
      for (const badge of userDoc.badges) {
        if (badge === "early-adopter") {
          log("User has early-adopter badge!");
          const aiResponse = await handleInteraction(userMessage);
          return res.json({ response: aiResponse });
        } else {
          log("User does not have early-adopter badge!");
          return res.json({
            response: "You need to be an early-adopter to use this feature!",
          });
        }
      }
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
