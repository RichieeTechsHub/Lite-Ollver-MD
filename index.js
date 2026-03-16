const nodeCrypto = require("crypto");

// Make crypto available everywhere before loading the bot
global.crypto = nodeCrypto;
globalThis.crypto = nodeCrypto;
global.webcrypto = nodeCrypto.webcrypto;
globalThis.webcrypto = nodeCrypto.webcrypto;

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
