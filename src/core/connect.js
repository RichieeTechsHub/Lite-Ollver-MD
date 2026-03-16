const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { handleMessages } = require("./handler");
const config = require("../../config");
const fs = require("fs");
const path = require("path");

async function connect() {
  console.log("📁 Checking session folder...");
  
  // Create session folder if it doesn't exist
  const sessionDir = path.join(process.cwd(), "session");
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
    console.log("📁 Created session folder");
  }
  
  // Check if session files exist
  const sessionFiles = fs.readdirSync(sessionDir);
  console.log(`📊 Found ${sessionFiles.length} session files`);
  
  // If SESSION_ID is provided but no session files, create a session file
  if (config.SESSION_ID && sessionFiles.length === 0) {
    console.log("🔐 Saving SESSION_ID from environment");
    fs.writeFileSync(path.join(sessionDir, "session.txt"), config.SESSION_ID);
    console.log("✅ Session ID saved");
  }

  try {
    console.log("🔄 Loading auth state...");
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    
    console.log("🔄 Connecting to WhatsApp...");
    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);
    
    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
      if (connection === "connecting") {
        console.log("🔄 Connecting to WhatsApp...");
      }
      
      if (connection === "open") {
        console.log("╔══════════════════════════════════╗");
        console.log("║   ✅ BOT CONNECTED!             ║");
        console.log("╚══════════════════════════════════╝");
        console.log(`👑 Owner: ${config.OWNER_NAME}`);
        console.log(`🤖 Bot: ${config.BOT_NAME}`);
        console.log(`🔣 Prefix: ${config.PREFIX}`);
        console.log(`📱 Logged in successfully!`);
      }
      
      if (connection === "close") {
        console.log("❌ Connection closed:", lastDisconnect?.error?.message);
        console.log("🔄 Reconnecting in 5 seconds...");
        setTimeout(connect, 5000);
      }
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;
      const msg = messages[0];
      if (!msg?.message) return;
      await handleMessages(sock, msg);
    });

    return sock;
  } catch (error) {
    console.error("❌ Connection error:", error.message);
    console.log("🔄 Retrying in 5 seconds...");
    setTimeout(connect, 5000);
  }
}

module.exports = connect;
