const { startBot } = require("./src/bot/connect");

async function bootstrap() {
  try {
    console.log("🚀 Starting Lite-Ollver-MD...");
    await startBot();
  } catch (err) {
    console.error("❌ Fatal startup error:", err);
    process.exit(1);
  }
}

bootstrap();
