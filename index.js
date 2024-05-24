module.exports = async function (req, res) {
  const name = req.payload.name || "World";
  res.json({
    message: `Hello, ${name}!`,
  });
};
