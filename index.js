// index.js - Make sure it doesn't depend on server
const connect = require("./src/core/connect");

console.log("🚀 Starting Lite-Ollver-MD Worker...");

connect().catch(error => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
