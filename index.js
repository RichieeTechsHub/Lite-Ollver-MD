const { startServer } = require("./server");
const connect = require("./src/core/connect");

console.log("🚀 Starting Lite-Ollver-MD...");
startServer();
connect().catch(console.error);