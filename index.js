export default async function (req, res) {
  if (!res || typeof res.json !== "function") {
    throw new TypeError(
      "Response object is not defined or does not have a json method"
    );
  }

  res.json({
    message: `Hello, World!`,
  });
}
