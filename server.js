const express = require("express");
const path = require("path");
const config = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "health.html"));
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", bot: config.BOT_NAME });
});

function startServer() {
  app.listen(PORT, () => console.log(`🌐 Server on port ${PORT}`));
}

module.exports = { startServer };