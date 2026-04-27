const express = require("express");
const connect = require("./src/core/connect");

console.log("╔══════════════════════════════════╗");
console.log("║     🚀 LITE-OLLVER-MD BOT       ║");
console.log("║     Starting WhatsApp Bot...    ║");
console.log("╚══════════════════════════════════╝");

// 🔥 Web server (for Heroku auto start)
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🤖 Lite-Ollver-MD is running...");
});

app.listen(PORT, () => {
  console.log("🌐 Web server running on port " + PORT);
});

// 🔥 Error handling
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err?.message || err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err?.message || err);
});

// 🔥 Start bot
connect().catch((error) => {
  console.error("❌ Fatal error:", error?.message || error);
  setTimeout(() => process.exit(1), 5000);
});
