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
const { handleMessages, sendStartupMessage } = require("./handler");
const config = require("../../config");

let isConnecting = false;
let reconnectTimeout = null;
let reconnectAttempts = 0;
const MAX_RECONNECTS = 5;

function cleanSessionId(sessionId = "") {
  return String(sessionId)
    .replace(/^LITE-OLLVER-MD[:~]/i, "")
    .replace(/^LITE-OLIVER-MD[:~]/i, "")
    .replace(/^ELITE-OLLVER-MD[:~]/i, "")
    .trim();
}

async function writeSessionFromEnv(sessionDir) {
  const rawSession = config.SESSION_ID || process.env.SESSION_ID;

  if (!rawSession) {
    console.log("⚠️ No SESSION_ID found in config vars.");
    return false;
  }

  const cleaned = cleanSessionId(rawSession);

  let decoded;
  try {
    decoded = Buffer.from(cleaned, "base64").toString("utf-8");
  } catch (error) {
    console.log("❌ Failed to base64 decode SESSION_ID");
    throw error;
  }

  let parsed;
  try {
    parsed = JSON.parse(decoded);
  } catch (error) {
    console.log("❌ SESSION_ID decoded text is not valid JSON");
    throw error;
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Decoded SESSION_ID is invalid");
  }

  if (parsed.creds) {
    fs.writeFileSync(
      path.join(sessionDir, "creds.json"),
      JSON.stringify(parsed.creds, null, 2)
    );

    if (parsed.keys && typeof parsed.keys === "object") {
      for (const [keyName, value] of Object.entries(parsed.keys)) {
        fs.writeFileSync(
          path.join(sessionDir, `${keyName}.json`),
          JSON.stringify(value, null, 2)
        );
      }
    }

    console.log("✅ SESSION_ID decoded into Baileys auth files.");
    return true;
  }

  fs.writeFileSync(
    path.join(sessionDir, "creds.json"),
    JSON.stringify(parsed, null, 2)
  );

  console.log("✅ SESSION_ID saved as creds.json.");
  return true;
}

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

    if (sessionFiles.length === 0) {
      console.log("🔐 No session files found, trying SESSION_ID auto login...");
      await writeSessionFromEnv(sessionDir);
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

    sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        console.log("⚠️ QR generated. Current SESSION_ID/session is not valid for automatic login.");
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

        await sendStartupMessage(sock);
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
          console.log("🚫 Session logged out. Generate a fresh SESSION_ID.");
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
        console.log(`📨 messages.upsert type=${type} count=${messages?.length || 0}`);

        if (!messages?.length) return;

        for (const msg of messages) {
          if (!msg?.message) continue;

          const from = msg.key?.remoteJid || "unknown";
          const fromMe = !!msg.key?.fromMe;

          console.log(`📩 Incoming event from=${from} fromMe=${fromMe}`);

          await handleMessages(sock, msg);
        }
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
