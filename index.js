const { startBot } = require("./src/bot/connect")

console.log("🚀 Starting Lite-Ollver-MD...")

startBot()

// keep process alive so Heroku doesn't restart it
setInterval(() => {}, 1000)
