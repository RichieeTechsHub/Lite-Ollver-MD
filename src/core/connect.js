const nodeCrypto = require("crypto");

if (!global.crypto) global.crypto = nodeCrypto.webcrypto;
if (!globalThis.crypto) globalThis.crypto = nodeCrypto.webcrypto;
if (!global.webcrypto) global.webcrypto = nodeCrypto.webcrypto;
if (!globalThis.webcrypto) globalThis.webcrypto = nodeCrypto.webcrypto;

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const { handleMessages } = require("./handler");
const config = require("../../config");

let isConnecting = false;
let reconnectTimeout = null;
let reconnectAttempts = 0;
const MAX_RECONNECTS = 5;

async function connect() {
  if (isConnecting) {
    console.log("⏳ Connection already in progress...");
    return;
  }

  isConnecting = true;

  try {
    console.log("📁 Checking session folder...");

    const sessionDir = path.join(process.cwd(), "session");
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
      console.log("📁 Created session folder");
    }

    const sessionFiles = fs.readdirSync(sessionDir);
    console.log(`📊 Found ${sessionFiles.length} session files`);

    // Important:
    // useMultiFileAuthState expects proper Baileys auth files inside /session.
    // Writing SESSION_ID into session.txt does NOT create a valid auth state.
    if (config.SESSION_ID && sessionFiles.length === 0) {
      console.log("ℹ️ SESSION_ID exists, but this skeleton expects real Baileys auth files in /session.");
      console.log("ℹ️ If you use SESSION_ID-based login, it must be decoded into proper session files first.");
    }

    console.log("🔄 Loading auth state...");
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const { version } = await fetchLatestBaileysVersion();

    console.log("🔄 Connecting to WhatsApp...");
    const sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      markOnlineOnConnect: true,
      syncFullHistory: false,
      browser: ["Lite-Ollver-MD", "Chrome", "1.0.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        console.log("⚠️ QR generated. Current auth/session is not valid for automatic login.");
      }

      if (connection === "connecting") {
        console.log("🔄 Connecting to WhatsApp...");
      }

      if (connection === "open") {
        reconnectAttempts = 0;
        isConnecting = false;

        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }

        console.log("╔══════════════════════════════════╗");
        console.log("║   ✅ BOT CONNECTED!             ║");
        console.log("╚══════════════════════════════════╝");
        console.log(`👑 Owner: ${config.OWNER_NAME}`);
        console.log(`🤖 Bot: ${config.BOT_NAME}`);
        console.log(`🔣 Prefix: ${config.PREFIX}`);
        console.log("📱 Logged in successfully!");
      }

      if (connection === "close") {
        isConnecting = false;

        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const errorMessage =
          lastDisconnect?.error?.message ||
          lastDisconnect?.error?.output?.payload?.message ||
          "Unknown connection error";

        console.log(`❌ Connection closed: ${errorMessage}`);

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("🚫 Session logged out. You need a fresh valid session.");
          return;
        }

        reconnectAttempts += 1;

        if (reconnectAttempts > MAX_RECONNECTS) {
          console.log("🛑 Too many reconnect attempts. Stopping.");
          return;
        }

        console.log(`🔄 Reconnecting in 5 seconds... Attempt ${reconnectAttempts}/${MAX_RECONNECTS}`);

        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(() => {
          connect().catch((err) => {
            console.error("❌ Reconnect failed:", err.message);
          });
        }, 5000);
      }
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      try {
        if (type !== "notify") return;

        const msg = messages?.[0];
        if (!msg?.message) return;

        console.log("📩 Incoming message event received");

        await handleMessages(sock, msg);
      } catch (error) {
        console.error("❌ Message handling error:", error.message);
      }
    });

    return sock;
  } catch (error) {
    isConnecting = false;
    console.error("❌ Connection error:", error.message);

    reconnectAttempts += 1;
    if (reconnectAttempts <= MAX_RECONNECTS) {
      console.log(`🔄 Retrying in 5 seconds... Attempt ${reconnectAttempts}/${MAX_RECONNECTS}`);

      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => {
        connect().catch((err) => {
          console.error("❌ Retry failed:", err.message);
        });
      }, 5000);
    } else {
      console.log("🛑 Too many retries. Stopping.");
    }
  }
}

module.exports = connect;
