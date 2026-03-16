const express = require("express");
const path = require("path");

// Load config with fallback
let config = { 
  BOT_NAME: "Lite-Ollver-MD",
  OWNER_NAME: "RichieeTheeGoat",
  OWNER_NUMBER: "254740479599"
};

try {
  const loadedConfig = require("./config");
  config = { ...config, ...loadedConfig };
} catch (err) {
  console.log("⚠️ Config file not found, using defaults");
}

const app = express();
const PORT = process.env.PORT || 3000;

// Create public directory if it doesn't exist
const fs = require("fs");
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create health.html if it doesn't exist
const healthPath = path.join(publicDir, "health.html");
if (!fs.existsSync(healthPath)) {
  const healthContent = `<!DOCTYPE html>
<html>
<head>
    <title>Lite-Ollver-MD</title>
    <style>
        body { background: #0a0a0a; color: #00ff88; font-family: Arial; text-align: center; padding: 50px; }
        h1 { font-size: 3em; text-shadow: 0 0 10px #00ff88; }
        .status { background: #00ff88; color: black; padding: 10px 30px; border-radius: 50px; display: inline-block; }
    </style>
</head>
<body>
    <h1>⚡ Lite-Ollver-MD</h1>
    <div class="status">✅ BOT IS RUNNING</div>
    <p>WhatsApp Bot Active on Heroku</p>
    <p>👑 Owner: ${config.OWNER_NAME}</p>
</body>
</html>`;
  fs.writeFileSync(healthPath, healthContent);
}

app.use(express.static(publicDir));

app.get("/", (req, res) => {
  res.sendFile(healthPath);
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    bot: config.BOT_NAME,
    owner: config.OWNER_NAME,
    time: new Date().toISOString()
  });
});

const server = app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
  console.log(`✅ Health check available at /health`);
  console.log(`🤖 Bot: ${config.BOT_NAME}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
  });
});

module.exports = { startServer: () => server };
