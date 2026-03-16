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
const { getSettings } = require("../utils/settings");

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

function cleanNumber(value = "") {
  return String(value).replace(/\D/g, "");
}

function loadAllCommandFiles() {
  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = [];

  if (!fs.existsSync(commandsPath)) return commandFiles;

  const categories = fs.readdirSync(commandsPath);

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);

    if (fs.existsSync(categoryPath) && fs.lstatSync(categoryPath).isDirectory()) {
      const files = fs
        .readdirSync(categoryPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of files) {
        commandFiles.push(path.join(categoryPath, file));
      }
    }
  }

  return commandFiles;
}

async function executeCommand(sock, messageEvent, runtimeStart) {
  try {
    const msg = messageEvent?.messages?.[0];
    if (!msg || !msg.message) return;

    const settings = await getSettings();

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      "";

    if (!body) return;

    console.log("📩 Incoming message:", {
      from: msg?.key?.remoteJid,
      fromMe: msg?.key?.fromMe,
      text: body
    });

    const prefix = settings.prefix || config.PREFIX || ".";
    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();
    if (!command) return;

    const commandFiles = loadAllCommandFiles();

    for (const file of commandFiles) {
      delete require.cache[require.resolve(file)];
      const cmd = require(file);

      if (
        cmd.name === command ||
        (Array.isArray(cmd.alias) && cmd.alias.includes(command))
      ) {
        const reply = async (text) => {
          await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
        };

        return await cmd.execute({
          sock,
          msg,
          args,
          command,
          config,
          settings,
          runtimeStart,
          reply
        });
      }
    }
  } catch (error) {
    console.error("❌ Command execution crashed:", error);
  }
}

async function sendOwnerConnectedMessage(sock, runtimeStart) {
  try {
    const settings = await getSettings();
    const ownerNumber = cleanNumber(settings.ownerNumber || config.OWNER_NUMBER);

    if (!ownerNumber) return;

    const ownerJid = `${ownerNumber}@s.whatsapp.net`;
    const speed = `${Date.now() - runtimeStart} ms`;
    const prefix = settings.prefix || config.PREFIX || ".";
    const ownerName = settings.ownerName || config.OWNER_NAME || "Owner";
    const waLink = `https://wa.me/${ownerNumber}`;

    const text = [
      "╭━━━〔 *LITE-OLLVER-MD* 〕━━━╮",
      "✅ Connected Successfully",
      "",
      `⚡ Speed: ${speed}`,
      `🔣 Prefix: ${prefix}`,
      `👑 Owner: ${ownerName}`,
      `🔗 WhatsApp: ${waLink}`,
      "",
      "Bot is now active in your inbox.",
      "╰━━━━━━━━━━━━━━━━━━━━━━╯"
    ].join("\n");

    await sock.sendMessage(ownerJid, { text });
  } catch (error) {
    console.error("❌ Failed to send owner startup message:", error);
  }
}

async function startBot() {
  try {
    const runtimeStart = Date.now();
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
      await executeCommand(sock, messageEvent, runtimeStart);
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

        await sendOwnerConnectedMessage(sock, runtimeStart);
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