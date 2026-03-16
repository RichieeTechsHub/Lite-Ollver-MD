const { startBot } = require("./src/bot/connect");

startBot().catch((error) => {
  console.error("Fatal startup error:", error);
  process.exit(1);
});