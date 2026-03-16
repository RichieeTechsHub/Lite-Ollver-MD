const nodeCrypto = require("crypto")

/*
Force WebCrypto globally BEFORE any other imports
This fixes "crypto is not defined" in Baileys on Heroku
*/

global.crypto = nodeCrypto.webcrypto
globalThis.crypto = nodeCrypto.webcrypto

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto.webcrypto
}

if (!global.crypto) {
  global.crypto = nodeCrypto.webcrypto
}

console.log("🔐 WebCrypto patched successfully")

const { startBot } = require("./src/bot/connect")

async function bootstrap() {
  try {
    console.log("🚀 Starting Lite-Ollver-MD...")
    await startBot()
  } catch (error) {
    console.error("❌ Fatal startup error:", error.message)
    process.exit(1)
  }
}

bootstrap()
