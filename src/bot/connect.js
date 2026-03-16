const nodeCrypto = require("crypto");

if (!global.crypto) global.crypto = nodeCrypto.webcrypto;
if (!globalThis.crypto) globalThis.crypto = nodeCrypto.webcrypto;
if (!global.webcrypto) global.webcrypto = nodeCrypto.webcrypto;
if (!globalThis.webcrypto) globalThis.webcrypto = nodeCrypto.webcrypto;

const fs = require("fs");
const path = require("path");
const pino = require("pino");
const {
  default: makeWASocket,
  fetchLatestBaileysVersion,
  DisconnectReason,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const {
  SESSION_DIR,
  hasSessionId,
  sessionFilesExist,
  decodeSession
} = require("./session");

const logger = pino({ level: "silent" });

let reconnectAttempts = 0;
let isStarting = false;

function unwrapMessage(message = {}) {
  if (message.ephemeralMessage?.message) return unwrapMessage(message.ephemeralMessage.message);
  if (message.viewOnceMessage?.message) return unwrapMessage(message.viewOnceMessage.message);
  if (message.viewOnceMessageV2?.message) return unwrapMessage(message.viewOnceMessageV2.message);
  if (message.documentWithCaptionMessage?.message) return unwrapMessage(message.documentWithCaptionMessage.message);
  return message;
}

function extractText(rawMessage = {}) {
  const message = unwrapMessage(rawMessage);

  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.documentMessage?.caption ||
    message.buttonsResponseMessage?.selectedButtonId ||
    message.listResponseMessage?.singleSelectReply?.selectedRowId ||
    message.templateButtonReplyMessage?.selectedId ||
    ""
  ).trim();
}

async function prepareSession() {
  if (!(await sessionFilesExist())) {
    if (!hasSessionId()) {
      console.log("⚠️ No SESSION_ID found in environment variables.");
      return false;
    }

    await decodeSession();
    console.log("✅ SESSION_ID decoded successfully.");
  } else {
    console.log("✅ Existing session files found.");
  }

  return true;
}

async function sendStartupMessage(sock, runtimeStart) {
  try {
    const myJid = sock.user?.id;
    if (!myJid) return;

    const logoPath = path.join(process.cwd(), "assets", "logo.png");
    const ownerNumber = process.env.OWNER_NUMBER || "254740479599";
    const ownerName = process.env.OWNER_NAME || "RichiieeTheeGoat";
    const prefix = process.env.PREFIX || ".";
    const speed = `${Date.now() - runtimeStart} ms`;

    const caption = [
      "╭━━━〔 *ELITE-OLLVER-MD* 〕━━━╮",
      "✅ Connected Successfully",
      "",
      `⚡ Speed: ${speed}`,
      `🔣 Prefix: ${prefix}`,
      `👑 Owner: ${ownerName}`,
      `📱 Owner Number: ${ownerNumber}`,
      "",
      "Bot is now active in your inbox.",
      "╰━━━━━━━━━━━━━━━━━━━━━━╯"
    ].join("\n");

    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      await sock.sendMessage(myJid, { image: imageBuffer, caption });
    } else {
      await sock.sendMessage(myJid, { text: caption });
    }

    console.log("✅ Startup message sent successfully");
  } catch (error) {
    console.error("❌ Failed to send startup message:", error.message);
  }
}

async function reply(sock, jid, text, quoted) {
  await sock.sendMessage(jid, { text }, quoted ? { quoted } : {});
}

async function sendMenu(sock, jid, quoted) {
  const prefix = process.env.PREFIX || ".";
  const ownerName = process.env.OWNER_NAME || "RichiieeTheeGoat";
  const logoPath = path.join(process.cwd(), "assets", "logo.png");

  const menuText = [
    "┏▣ ◈ *Lite-Ollver-MD* ◈",
    `┃ *OWNER* : ${ownerName}`,
    `┃ *PREFIX* : [ ${prefix} ]`,
    "┃ *HOST* : Heroku Worker",
    `┃ *MODE* : ${process.env.MODE || "private"}`,
    "┗▣",
    "",
    "┏▣ ◈ *MAIN MENU* ◈",
    "│➽ ping",
    "│➽ alive",
    "│➽ menu",
    "│➽ owner",
    "│➽ repo",
    "│➽ getsettings",
    "│➽ vars",
    "┗▣"
  ].join("\n");

  if (fs.existsSync(logoPath)) {
    const imageBuffer = fs.readFileSync(logoPath);
    await sock.sendMessage(jid, { image: imageBuffer, caption: menuText }, quoted ? { quoted } : {});
  } else {
    await reply(sock, jid, menuText, quoted);
  }
}

async function handleCommand(sock, msg) {
  try {
    if (!msg?.message) return;

    const body = extractText(msg.message);
    if (!body) return;

    const from = msg.key.remoteJid;
    const prefix = process.env.PREFIX || ".";

    console.log(`📩 Incoming: "${body}" | from=${from} | fromMe=${msg.key.fromMe}`);

    if (!body.startsWith(prefix)) return;

    const parts = body.slice(prefix.length).trim().split(/\s+/);
    const command = (parts.shift() || "").toLowerCase();

    if (!command) return;

    console.log(`✅ Command detected: ${command}`);

    switch (command) {
      case "ping":
        return await reply(sock, from, "🏓 Pong! Bot is alive.", msg);

      case "alive":
        return await reply(
          sock,
          from,
          [
            "✅ *Lite-Ollver-MD* is active.",
            `👑 Owner: ${process.env.OWNER_NAME || "RichiieeTheeGoat"}`,
            `📱 Owner Number: ${process.env.OWNER_NUMBER || "254740479599"}`,
            `🔣 Prefix: ${prefix}`,
            `🌍 Mode: ${process.env.MODE || "private"}`
          ].join("\n"),
          msg
        );

      case "menu":
        return await sendMenu(sock, from, msg);

      case "owner":
        return await reply(
          sock,
          from,
          `👑 Owner: ${process.env.OWNER_NAME || "RichiieeTheeGoat"}\n📱 Number: ${process.env.OWNER_NUMBER || "254740479599"}`,
          msg
        );

      case "repo":
        return await reply(
          sock,
          from,
          "🌐 Repo: https://github.com/RichieeTechsHub/Lite-Ollver-MD",
          msg
        );

      case "getsettings":
      case "settings":
        return await reply(
          sock,
          from,
          [
            "⚙️ *CURRENT SETTINGS*",
            `BOT_NAME: ${process.env.BOT_NAME || "Lite-Ollver-MD"}`,
            `OWNER_NAME: ${process.env.OWNER_NAME || "RichiieeTheeGoat"}`,
            `OWNER_NUMBER: ${process.env.OWNER_NUMBER || "254740479599"}`,
            `PREFIX: ${prefix}`,
            `MODE: ${process.env.MODE || "private"}`,
            `TIMEZONE: ${process.env.TIMEZONE || "Africa/Nairobi"}`
          ].join("\n"),
          msg
        );

      case "vars":
        return await reply(
          sock,
          from,
          [
            "📦 *BOT VARIABLES*",
            `BOT_NAME: ${process.env.BOT_NAME || "Lite-Ollver-MD"}`,
            `OWNER_NAME: ${process.env.OWNER_NAME || "RichiieeTheeGoat"}`,
            `OWNER_NUMBER: ${process.env.OWNER_NUMBER || "254740479599"}`,
            `PREFIX: ${prefix}`,
            `MODE: ${process.env.MODE || "private"}`
          ].join("\n"),
          msg
        );

      default:
        return await reply(sock, from, `❌ Unknown command: ${command}`, msg);
    }
  } catch (error) {
    console.error("❌ Command handler error:", error.message);
  }
}

async function startBot() {
  if (isStarting) return;
  isStarting = true;

  try {
    const runtimeStart = Date.now();
    const ready = await prepareSession();

    if (!ready) {
      isStarting = false;
      return;
    }

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: false,
      auth: state,
      browser: ["Lite-Ollver-MD", "Chrome", "1.0.0"],
      markOnlineOnConnect: true,
      syncFullHistory: false,
      defaultQueryTimeoutMs: 60000
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (event) => {
      try {
        console.log(`📨 messages.upsert | type=${event?.type || "unknown"} | count=${event?.messages?.length || 0}`);

        const msg = event?.messages?.[0];
        if (!msg || !msg.message) return;

        await handleCommand(sock, msg);
      } catch (error) {
        console.error("❌ messages.upsert error:", error.message);
      }
    });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log("⚠️ QR generated unexpectedly. SESSION_ID may be invalid.");
      }

      if (connection === "connecting") {
        console.log("🔄 Connecting Lite-Ollver-MD to WhatsApp...");
      }

      if (connection === "open") {
        reconnectAttempts = 0;
        isStarting = false;
        console.log("✅ Lite-Ollver-MD connected successfully.");
        await sendStartupMessage(sock, runtimeStart);
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const errorMessage =
          lastDisconnect?.error?.message ||
          lastDisconnect?.error?.output?.payload?.message ||
          "Unknown error";

        console.log(`❌ Connection closed. Code: ${statusCode || "none"} | ${errorMessage}`);

        isStarting = false;

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("🚫 Session logged out. Generate a new SESSION_ID.");
          return;
        }

        reconnectAttempts += 1;

        if (reconnectAttempts > 5) {
          console.log("🛑 Too many reconnect attempts. Stopping to protect memory.");
          return;
        }

        const delay = 10000;
        console.log(`♻️ Reconnecting in ${delay / 1000} seconds... Attempt ${reconnectAttempts}/5`);

        setTimeout(() => {
          startBot().catch((err) => {
            console.error("Reconnect failed:", err.message);
          });
        }, delay);
      }
    });

    return sock;
  } catch (error) {
    isStarting = false;
    console.error("❌ Error in startBot:", error.message);
    throw error;
  }
}

module.exports = startBot;
