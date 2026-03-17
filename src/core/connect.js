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

let sock = null;
let isConnecting = false;
let reconnectTimeout = null;
let keepAliveInterval = null;
let startupMessageSent = false;

const SESSION_DIR = path.join(process.cwd(), "session");

function cleanSessionId(sessionId = "") {
  return String(sessionId)
    .replace(/^LITE-OLLVER-MD[:~]/i, "")
    .replace(/^LITE-OLIVER-MD[:~]/i, "")
    .replace(/^ELITE-OLLVER-MD[:~]/i, "")
    .trim();
}

function ensureSessionDir() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
    console.log("📁 Created session folder");
  }
}

function clearReconnectTimeout() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
}

function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

function startKeepAlive(currentSock) {
  stopKeepAlive();

  keepAliveInterval = setInterval(async () => {
    try {
      if (currentSock?.user) {
        await currentSock.sendPresenceUpdate("available");
        console.log("💓 Keep-alive sent");
      }
    } catch (error) {
      console.log("⚠️ Keep-alive failed:", error.message);
    }
  }, 20000);
}

function clearBrokenSessionFiles() {
  try {
    if (!fs.existsSync(SESSION_DIR)) return;

    const files = fs.readdirSync(SESSION_DIR);
    for (const file of files) {
      fs.rmSync(path.join(SESSION_DIR, file), { force: true, recursive: true });
    }

    console.log("🧹 Cleared broken session files");
  } catch (error) {
    console.log("⚠️ Failed to clear session files:", error.message);
  }
}

async function writeSessionFromEnv() {
  const rawSession = config.SESSION_ID || process.env.SESSION_ID;

  if (!rawSession) {
    console.log("⚠️ No SESSION_ID found in environment/config.");
    return false;
  }

  const cleaned = cleanSessionId(rawSession);

  let decoded;
  try {
    decoded = Buffer.from(cleaned, "base64").toString("utf-8");
  } catch (error) {
    console.log("❌ Failed to base64 decode SESSION_ID");
    return false;
  }

  let parsed;
  try {
    parsed = JSON.parse(decoded);
  } catch (error) {
    console.log("❌ SESSION_ID decoded text is not valid JSON");
    return false;
  }

  if (!parsed || typeof parsed !== "object") {
    console.log("❌ SESSION_ID is invalid");
    return false;
  }

  if (parsed.creds) {
    fs.writeFileSync(
      path.join(SESSION_DIR, "creds.json"),
      JSON.stringify(parsed.creds, null, 2)
    );

    if (parsed.keys && typeof parsed.keys === "object") {
      for (const [keyName, value] of Object.entries(parsed.keys)) {
        fs.writeFileSync(
          path.join(SESSION_DIR, `${keyName}.json`),
          JSON.stringify(value, null, 2)
        );
      }
    }

    console.log("✅ SESSION_ID decoded into Baileys auth files");
    return true;
  }

  fs.writeFileSync(
    path.join(SESSION_DIR, "creds.json"),
    JSON.stringify(parsed, null, 2)
  );

  console.log("✅ SESSION_ID saved as creds.json");
  return true;
}

async function prepareSession() {
  ensureSessionDir();

  const files = fs.readdirSync(SESSION_DIR);
  console.log(`📁 Session folder: ${SESSION_DIR}`);
  console.log(`📊 Found ${files.length} session files`);

  if (files.length === 0) {
    console.log("🔐 No local session files found, trying SESSION_ID...");
    await writeSessionFromEnv();
  }
}

async function sendStartupMessage(currentSock) {
  if (startupMessageSent) return;

  try {
    const ownerNumber = String(config.OWNER_NUMBER || "").replace(/\D/g, "");
    if (!ownerNumber) {
      console.log("⚠️ OWNER_NUMBER is missing, startup message skipped");
      return;
    }

    const ownerJid = `${ownerNumber}@s.whatsapp.net`;

    await currentSock.sendMessage(ownerJid, {
      text: `╔══════════════════════════════════╗
║   ✅ BOT CONNECTED SUCCESSFULLY  ║
╚══════════════════════════════════╝

👑 Owner: ${config.OWNER_NAME || "Unknown"}
🤖 Bot: ${config.BOT_NAME || "Bot"}
🔣 Prefix: ${config.PREFIX || "."}
🌍 Mode: ${config.MODE || "private"}
⚡ Status: Online

╔══════════════════════════════════╗
║   📥 Bot is active NOW!          ║
║   Try sending: .ping             ║
║                .menu             ║
║                .owner            ║
╚══════════════════════════════════╝`
    });

    startupMessageSent = true;
    console.log("✅ Startup message sent to owner inbox");
  } catch (error) {
    console.log("⚠️ Could not send startup message:", error.message);
  }
}

function shouldResetSession(lastDisconnect) {
  const msg =
    lastDisconnect?.error?.message ||
    lastDisconnect?.error?.output?.payload?.message ||
    "";

  return /bad mac|failed to decrypt message with any known session/i.test(msg);
}

async function connect() {
  if (isConnecting) {
    console.log("⏳ Connection already in progress...");
    return sock;
  }

  isConnecting = true;
  clearReconnectTimeout();

  try {
    await prepareSession();

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    const { version } = await fetchLatestBaileysVersion();

    console.log("🔄 Connecting to WhatsApp...");

    sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      markOnlineOnConnect: true,
      syncFullHistory: false,
      browser: ["Lite-Ollver-MD", "Chrome", "1.0.0"],
      keepAliveIntervalMs: 20000,
      generateHighQualityLinkPreview: false,
      shouldSyncHistory: false,
      defaultQueryTimeoutMs: 60000
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, receivedPendingNotifications } = update;

      if (connection === "connecting") {
        console.log("🔄 Connecting to WhatsApp...");
      }

      if (receivedPendingNotifications) {
        console.log("📬 Pending notifications synced");
      }

      if (connection === "open") {
        isConnecting = false;
        clearReconnectTimeout();
        startKeepAlive(sock);

        console.log("╔══════════════════════════════════╗");
        console.log("║   ✅ BOT CONNECTED SUCCESSFULLY ║");
        console.log("╚══════════════════════════════════╝");
        console.log(`👑 Owner: ${config.OWNER_NAME}`);
        console.log(`🤖 Bot: ${config.BOT_NAME}`);
        console.log(`🔣 Prefix: ${config.PREFIX}`);
        console.log(`🌍 Mode: ${config.MODE}`);
        console.log(`📱 Logged in as: ${sock.user?.id || "Unknown"}`);

        try {
          await sock.sendPresenceUpdate("available");
        } catch (_) {}

        await sendStartupMessage(sock);
      }

      if (connection === "close") {
        isConnecting = false;
        stopKeepAlive();
        startupMessageSent = false;

        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const errorMessage =
          lastDisconnect?.error?.message ||
          lastDisconnect?.error?.output?.payload?.message ||
          "Unknown connection error";

        console.log(`❌ Connection closed: ${errorMessage}`);

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("🚫 Logged out. Delete session and use a fresh SESSION_ID.");
          return;
        }

        if (shouldResetSession(lastDisconnect)) {
          console.log("⚠️ Broken/corrupted session detected");
          clearBrokenSessionFiles();
          await writeSessionFromEnv();
        }

        reconnectTimeout = setTimeout(() => {
          connect().catch((err) => {
            console.error("❌ Reconnect failed:", err.message);
          });
        }, 4000);
      }
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      try {
        if (!Array.isArray(messages) || messages.length === 0) return;

        for (const msg of messages) {
          if (!msg) continue;
          if (!msg.message) continue;
          if (msg.key?.remoteJid === "status@broadcast") continue;

          console.log(
            `📩 Message event | type=${type || "unknown"} | from=${msg.key?.remoteJid} | fromMe=${msg.key?.fromMe ? "yes" : "no"}`
          );

          await handleMessages(sock, msg);
        }
      } catch (error) {
        console.error("❌ Message listener error:", error);
      }
    });

    sock.ev.on("messages.update", async (updates) => {
      try {
        if (!Array.isArray(updates)) return;
        for (const item of updates) {
          if (item?.update?.status) {
            console.log(`✏️ Message update status: ${item.update.status}`);
          }
        }
      } catch (_) {}
    });

    sock.ev.on("presence.update", (update) => {
      if (update?.id) {
        console.log(`👀 Presence update from: ${update.id}`);
      }
    });

    return sock;
  } catch (error) {
    isConnecting = false;
    stopKeepAlive();

    console.error("❌ Connection error:", error.message);

    reconnectTimeout = setTimeout(() => {
      connect().catch((err) => {
        console.error("❌ Retry failed:", err.message);
      });
    }, 5000);
  }
}

module.exports = connect;
