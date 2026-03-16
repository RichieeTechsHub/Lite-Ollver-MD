// src/core/connect.js
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { handleMessages } = require("./handler");
const config = require("../../config");
const fs = require("fs");

async function connect() {
  console.log("📁 Initializing session...");
  
  // Create session folder
  if (!fs.existsSync("./session")) {
    fs.mkdirSync("./session", { recursive: true });
  }

  // If SESSION_ID is provided (from Heroku env), save it
  if (config.SESSION_ID && config.SESSION_ID !== "your_session_id_here") {
    console.log("🔐 Using SESSION_ID from environment");
    // Save the session ID to a file or use it directly
    // This depends on how your session generator formats the ID
    fs.writeFileSync("./session/session.txt", config.SESSION_ID);
  }

  const { state, saveCreds } = await useMultiFileAuthState("./session");
  
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);
  
  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ Bot connected successfully!");
      console.log(`👑 Owner: ${config.OWNER_NAME}`);
      console.log(`🔣 Prefix: ${config.PREFIX}`);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    await handleMessages(sock, messages[0]);
  });

  return sock;
}

module.exports = connect;
