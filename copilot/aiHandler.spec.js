import { handleInteraction } from "./aiHandler.js"; // Ensure this path is correct
import { chatHistory } from "../instructions.js"; // Ensure this path is correct

describe("handleInteraction function", () => {
  it("should return a valid response object", async () => {
    // Sample user message
    const userMessage = "I have an apple.";

    // Call the handleInteraction function with the user message and chat history
    const response = await handleInteraction(userMessage, chatHistory);

    // Check that the response object has 'correction' and 'explanation' properties
    expect(response).toHaveProperty("correction");
    expect(response).toHaveProperty("explanation");

    // Check that 'correction' and 'explanation' are of type string or null
    expect(response.correction).toBeNull(); // Or check for type string if not null
    expect(response.explanation).toBeNull(); // Or check for type string if not null
  });

  it("should return a correction for a grammar fault", async () => {
    // User message with a grammar fault
    const userMessage = "I have a apple";

    // Call the handleInteraction function with the user message and chat history
    const response = await handleInteraction(userMessage, chatHistory);

    // Check that the response object has 'correction' and 'explanation' properties
    expect(response).toHaveProperty("correction");
    expect(response).toHaveProperty("explanation");

    // Check that 'correction' is not null and is a string
    expect(typeof response.correction).toBe("string");
    expect(typeof response.explanation).toBe("string");
  });
});
