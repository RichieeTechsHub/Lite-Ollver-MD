const fs = require("fs");
const path = require("path");
const pino = require("pino");
const {
  default: makeWASocket,
  fetchLatestBaileysVersion,
  DisconnectReason,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");

const config = require("../../config");
const {
  SESSION_DIR,
  hasSessionId,
  sessionFilesExist,
  decodeSession
} = require("./session");
const { buildMainMenu } = require("./menu");

const logger = pino({ level: "silent" });

async function prepareSession() {
  if (!(await sessionFilesExist())) {
    if (!hasSessionId()) {
      console.log("⚠️ No SESSION_ID found in environment variables.");
      console.log("ℹ️ Add SESSION_ID in Heroku config vars before starting the bot.");
      return false;
    }

    await decodeSession();
    console.log("✅ SESSION_ID decoded successfully.");
  }

  return true;
}

async function replyText(sock, msg, text) {
  await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
}

async function sendMenu(sock, msg) {
  const menuText = buildMainMenu({
    ownerName: config.OWNER_NAME,
    prefix: config.PREFIX,
    mode: config.MODE,
    version: config.VERSION,
    host: "Heroku",
    speed: "0.2100"
  });

  const logoPath = path.join(process.cwd(), "assets", "logo.png");

  if (fs.existsSync(logoPath)) {
    const imageBuffer = fs.readFileSync(logoPath);
    await sock.sendMessage(
      msg.key.remoteJid,
      {
        image: imageBuffer,
        caption: menuText
      },
      { quoted: msg }
    );
    return;
  }

  await replyText(sock, msg, menuText);
}

async function handleIncomingMessages(sock, messageEvent) {
  try {
    const msg = messageEvent?.messages?.[0];
    if (!msg || !msg.message) return;

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      "";

    console.log("📩 Incoming message:", {
      from: msg?.key?.remoteJid,
      fromMe: msg?.key?.fromMe,
      text: body
    });

    const prefix = config.PREFIX || ".";
    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (!command) return;

    if (command === "ping") {
      return await replyText(sock, msg, "Pong 🏓");
    }

    if (command === "alive") {
      return await replyText(
        sock,
        msg,
        `✅ *${config.BOT_NAME}* is active and running.\n👑 Owner: ${config.OWNER_NAME}\n🌍 Mode: ${config.MODE}\n⌨️ Prefix: ${config.PREFIX}`
      );
    }

    if (command === "menu" || command === "help") {
      return await sendMenu(sock, msg);
    }

    if (command === "owner") {
      return await replyText(
        sock,
        msg,
        `👑 Owner: ${config.OWNER_NAME}\n📱 Number: ${config.OWNER_NUMBER}`
      );
    }

    if (command === "repo") {
      return await replyText(
        sock,
        msg,
        "🌐 Repo: https://github.com/RichieeTechsHub/Lite-Ollver-MD"
      );
    }
  } catch (error) {
    console.error("❌ Inline handler crashed:", error);
  }
}

async function startBot() {
  try {
    const ready = await prepareSession();

    if (!ready) {
      console.log("⏳ Bot startup stopped because session is missing.");
      return;
    }

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: false,
      auth: state,
      browser: [
        config.BOT_NAME || "Lite-Ollver-MD",
        "Chrome",
        config.VERSION || "1.0.0"
      ],
      markOnlineOnConnect: true,
      syncFullHistory: false
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (messageEvent) => {
      await handleIncomingMessages(sock, messageEvent);
    });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "connecting") {
        console.log("🔄 Connecting Lite-Ollver-MD to WhatsApp...");
      }

      if (connection === "open") {
        console.log("✅ Lite-Ollver-MD connected successfully.");
        console.log(`🤖 Bot Name: ${config.BOT_NAME}`);
        console.log(`👑 Owner: ${config.OWNER_NAME}`);
        console.log(`🌍 Mode: ${config.MODE}`);
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log("❌ Connection closed.");

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("🚫 Session logged out. Generate a new SESSION_ID.");
          return;
        }

        if (shouldReconnect) {
          console.log("♻️ Reconnecting in 5 seconds...");
          setTimeout(() => {
            startBot().catch((err) => {
              console.error("Reconnect failed:", err);
            });
          }, 5000);
        }
      }
    });

    return sock;
  } catch (error) {
    console.error("❌ Error in startBot:", error);
    throw error;
  }
}

module.exports = { startBot };