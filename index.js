const connect = require("./src/core/connect");

console.log("╔══════════════════════════════════╗");
console.log("║     🚀 LITE-OLLVER-MD WORKER    ║");
console.log("║     Starting WhatsApp Bot...    ║");
console.log("╚══════════════════════════════════╝");

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
});

connect().catch(error => {
  console.error("❌ Fatal error:", error);
  setTimeout(() => {
    console.log("🔄 Restarting...");
    process.exit(1);
  }, 5000);
});
