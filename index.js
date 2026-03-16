const connect = require("./src/core/connect");

console.log("╔══════════════════════════════════╗");
console.log("║   🚀 Lite-Ollver-MD WORKER      ║");
console.log("║   Starting WhatsApp Bot...      ║");
console.log("╚══════════════════════════════════╝");

connect().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
