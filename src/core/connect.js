require("dotenv").config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const path = require("path");
const Pino = require("pino");
const { BOT_NAME, PREFIX, OWNER_NUMBER, OWNER_NAME, MODE, SESSION_ID } = require("../config");

// Helper: decode and restore session from SESSION_ID environment variable
async function restoreSessionFromEnv() {
  const sessionString = process.env.SESSION_ID || SESSION_ID || "";
  if (!sessionString) {
    console.log("⚠️ No SESSION_ID provided – will generate QR code on first run.");
    return false;
  }

  // Remove custom prefix like "LITE-OLLVER-MD:" or "session:"
  let base64Data = sessionString;
  if (sessionString.includes(":~")) {
    base64Data = sessionString.split(":~")[1];
  } else if (sessionString.includes(":")) {
    base64Data = sessionString.split(":")[1];
  }

  try {
    const decoded = Buffer.from(base64Data, "base64").toString("utf-8");
    const sessionData = JSON.parse(decoded);
    const authDir = "./auth_info";

    await fs.ensureDir(authDir);

    // Write creds.json
    if (sessionData.creds) {
      await fs.writeJson(path.join(authDir, "creds.json"), sessionData.creds, { spaces: 2 });
    }

    // Write all app-state-sync-key-*.json files
    if (sessionData.keys && typeof sessionData.keys === "object") {
      for (const [keyName, keyValue] of Object.entries(sessionData.keys)) {
        // keyName format: "pre-key-1", "app-state-sync-key-1", etc.
        let fileName;
        if (keyName.startsWith("pre-key-")) {
          fileName = `pre-key-${keyName.split("-")[2]}.json`;
        } else {
          fileName = `${keyName}.json`;
        }
        await fs.writeJson(path.join(authDir, fileName), keyValue, { spaces: 2 });
      }
    }

    console.log("✅ Session restored from SESSION_ID");
    return true;
  } catch (err) {
    console.error("❌ Failed to restore session:", err.message);
    return false;
  }
}

// Main connection function
async function connect() {
  await restoreSessionFromEnv();

  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,       // shows QR if no session exists
    logger: Pino({ level: "silent" }), // reduce logs
    browser: ["Lite-Ollver-MD", "Chrome", "120.0.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("🔐 Scan this QR code with WhatsApp:");
      // QR will be printed automatically by Baileys
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Session logged out. Delete auth_info folder and restart.");
        process.exit(1);
      } else {
        console.log("🔄 Connection closed, reconnecting...");
        connect();
      }
    } else if (connection === "open") {
      console.log(`✅ ${BOT_NAME} is online!`);
    }
  });

  // Optional: handle incoming messages (commands)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    if (!text.startsWith(PREFIX)) return;

    const args = text.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Example command handler – add your own
    if (command === "ping") {
      await sock.sendMessage(msg.key.remoteJid, { text: "Pong!" });
    }
    // More commands here...
  });
}

module.exports = connect;
