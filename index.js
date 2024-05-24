export default async function ({ req, res, log, error }) {
  try {
    // Log a message
    log("Function is running");

    // Check the request method
    if (req.method === "GET") {
      // Send a JSON response
      return res.json({ message: "Hello, World!" });
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
