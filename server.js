// server.js - UPDATED VERSION
const express = require("express");
const path = require("path");
const config = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "health.html"));
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    bot: config.BOT_NAME,
    time: new Date().toISOString()
  });
});

// IMPORTANT: This keeps the server running
const server = app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
  console.log(`✅ Health check available at /health`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
  });
});

module.exports = { startServer: () => server };
