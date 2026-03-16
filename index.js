const startBot = require("./src/bot/connect");

console.log("🚀 Starting Lite-Ollver-MD...");

startBot().catch((err) => {
  console.error("❌ Bot start error:", err);
});
