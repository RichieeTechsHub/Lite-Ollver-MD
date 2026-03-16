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

app.get("/info", (req, res) => {
  res.json({
    botName: config.BOT_NAME,
    ownerName: config.OWNER_NAME,
    ownerNumber: config.OWNER_NUMBER,
    prefix: config.PREFIX,
    mode: config.MODE
  });
});

function startServer() {
  app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
}

module.exports = { startServer };