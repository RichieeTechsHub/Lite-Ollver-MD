const express = require("express");
const path = require("path");
const config = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "health.html"));
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    bot: config.BOT_NAME,
    version: config.VERSION,
    mode: config.MODE,
    owner: config.OWNER_NAME,
    host: "Heroku"
  });
});

app.get("/info", (req, res) => {
  res.status(200).json({
    botName: config.BOT_NAME,
    ownerName: config.OWNER_NAME,
    ownerNumber: config.OWNER_NUMBER,
    supportGroup: config.SUPPORT_GROUP,
    prefix: config.PREFIX,
    timezone: config.TIMEZONE
  });
});

function startServer() {
  app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
  });
}

module.exports = { startServer };