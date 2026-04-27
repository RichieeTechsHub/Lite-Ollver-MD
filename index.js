const connect = require("./src/core/connect");

console.log("╔══════════════════════════════════╗");
console.log("║     🚀 LITE-OLLVER-MD BOT       ║");
console.log("║     Starting WhatsApp Bot...    ║");
console.log("╚══════════════════════════════════╝");

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err?.message || err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err?.message || err);
});

connect().catch((error) => {
  console.error("❌ Fatal error:", error?.message || error);
  setTimeout(() => process.exit(1), 5000);
});
