const nodeCrypto = require("crypto");

// Fix: ensure crypto exists globally for libraries that expect it
if (!global.crypto) {
  global.crypto = nodeCrypto.webcrypto;
}

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto.webcrypto;
}

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
