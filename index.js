const { startBot } = require("./src/bot/connect");

async function bootstrap() {
  try {
    console.log("🚀 Starting Lite-Ollver-MD...");
    await startBot();
  } catch (error) {
    console.error("❌ Fatal startup error:", error.message);
    process.exit(1);
  }
}

bootstrap();