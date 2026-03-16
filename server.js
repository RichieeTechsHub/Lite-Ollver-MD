const express = require("express");
const path = require("path");
const fs = require("fs");

let config = { 
  BOT_NAME: "Lite-Ollver-MD",
  OWNER_NAME: "RichieeTheeGoat",
  OWNER_NUMBER: "254740479599",
  SUPPORT_GROUP: "https://chat.whatsapp.com/JKF3XHbmKY47IQZc7d3LB2"
};

try {
  const loadedConfig = require("./config");
  config = { ...config, ...loadedConfig };
} catch (err) {
  console.log("⚠️ Using default config");
}

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const healthPath = path.join(publicDir, "health.html");
const healthContent = `<!DOCTYPE html>
<html>
<head>
    <title>${config.BOT_NAME}</title>
    <style>
        body { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            margin: 0 auto;
        }
        h1 { font-size: 3em; margin-bottom: 10px; }
        .status {
            background: #00ff88;
            color: black;
            padding: 10px 30px;
            border-radius: 50px;
            display: inline-block;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚡ ${config.BOT_NAME}</h1>
        <div class="status">✅ BOT IS ONLINE</div>
        <p>WhatsApp Bot Active on Heroku</p>
        <p>👑 Owner: ${config.OWNER_NAME}</p>
    </div>
</body>
</html>`;

fs.writeFileSync(healthPath, healthContent);

app.use(express.static(publicDir));

app.get("/", (req, res) => {
  res.sendFile(healthPath);
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    bot: config.BOT_NAME,
    time: new Date().toISOString()
  });
});

const server = app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
  });
});

module.exports = { startServer: () => server };
