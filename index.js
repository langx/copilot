import { Client, Databases } from "node-appwrite";
import { handleInteraction } from "./copilot/aiHandler.js";
import { throwIfMissing } from "./utils/utils.js";

// Event trigger:
// databases.650750f16cd0c482bb83.collections.65075108a4025a4f5bd7.documents.*.create

export default async ({ req, res, log, error }) => {
  try {
    log(req);
    throwIfMissing(req.body, ["to", "sender", "roomId", "type", "body"]);

    const type = req.body.type;
    const roomId = req.body.roomId.$id;

    if (type !== "body" || req.body.body === null) {
      return res.json(
        { ok: false, error: "Only body type messages are processed" },
        400
      );
    }

    // Init SDK
    const client = new Client()
      .setEndpoint(process.env.APP_ENDPOINT)
      .setProject(process.env.APP_PROJECT)
      .setKey(process.env.API_KEY);

    const db = new Databases(client);

    const userDoc = await db.getDocument(
      process.env.APP_DATABASE,
      process.env.USERS_COLLECTION,
      req.body.sender
    );
    log(userDoc);

    // Check if userDoc.badges has "early-adopter"
    if (!userDoc.badges.includes("early-adopter")) {
      log("User is not an early adopter");
      return res.json(
        { ok: false, error: "User is not an early adopter" },
        400
      );
    }

    const roomDoc = await db.getDocument(
      process.env.APP_DATABASE,
      process.env.ROOMS_COLLECTION,
      roomId
    );
    log(roomDoc);

    // Check if roomDoc.copilot includes this userId
    if (!roomDoc.copilot.includes(req.body.sender)) {
      log("User is not part of copilot in this room");
      return res.json(
        { ok: false, error: "User is not part of copilot in this room" },
        400
      );
    }

    // Additional logic for handling user interactions
    try {
      const userMessage = req.body.body;
      log(`userMessage: ${userMessage}`);
      log(`userId: ${req.body.to}`);

      const aiResponse = await handleInteraction(userMessage);
      log(aiResponse.text());

      const correction = aiResponse.text();
      const correctionObj = JSON.parse(correction);

      if (correctionObj.correction && correctionObj.explanation) {
        // Store the results in the copilot collection
        const copilotDoc = await db.createDocument(
          process.env.APP_DATABASE,
          process.env.COPILOT_COLLECTION,
          "unique()",
          {
            correction: correctionObj.correction,
            explanation: correctionObj.explanation,
            promptTokenCount: aiResponse.usageMetadata.promptTokenCount,
            candidatesTokenCount: aiResponse.usageMetadata.candidatesTokenCount,
            totalTokenCount: aiResponse.usageMetadata.totalTokenCount,
            sender: req.body.sender,
            roomId: roomId,
            messageId: req.body.$id,
          },
          [`read("user:${req.body.sender}")`]
        );

        log(`Successfully created copilot document: ${copilotDoc.$id}`);
      }

      return res.json({ response: correctionObj });
    } catch (err) {
      error(err.message);
      return res.send("An error occurred", 500);
    }
  } catch (err) {
    // Log any errors
    error(err.message);
    return res.send("An error occurred", 500);
  }
};
