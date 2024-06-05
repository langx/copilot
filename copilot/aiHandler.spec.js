import { handleInteraction } from "./aiHandler.js"; // Ensure this path is correct

describe("handleInteraction function", () => {
  it("should return a valid response object", async () => {
    const userMessage = "I have an apple.";
    let response = await handleInteraction(userMessage);

    // If the response is a stringified JSON, parse it
    if (typeof response === "string") {
      response = JSON.parse(response);
    }

    expect(response).toHaveProperty("correction");
    expect(response).toHaveProperty("explanation");

    // Check that 'correction' and 'explanation' are either null or of type string
    const isValidType = (value) => value === null || typeof value === "string";
    expect(isValidType(response.correction)).toBeTruthy();
    expect(isValidType(response.explanation)).toBeTruthy();
  });

  it("should return a correction for a grammar fault", async () => {
    const userMessage = "I have a apple";
    let response = await handleInteraction(userMessage);

    // If the response is a stringified JSON, parse it
    if (typeof response === "string") {
      response = JSON.parse(response);
    }

    expect(response).toHaveProperty("correction");
    expect(response).toHaveProperty("explanation");

    // Check that 'correction' and 'explanation' are of type string
    expect(typeof response.correction).toBe("string");
    expect(typeof response.explanation).toBe("string");
  });
});
