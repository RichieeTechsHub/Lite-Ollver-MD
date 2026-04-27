require("dotenv").config();

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  jidNormalizedUser,
} = require("@whiskeysockets/baileys");

const fs = require("fs-extra");
const path = require("path");
const Pino = require("pino");

const BOT_NAME = process.env.BOT_NAME || "Lite-Ollver-MD";
const PREFIX = process.env.PREFIX || ".";
const OWNER_NUMBER = process.env.OWNER_NUMBER || "254740479599";
const SESSION_ID = process.env.SESSION_ID || "";

const AUTH_DIR = path.join(__dirname, "../auth_info");

let commands = new Map();
let isConnecting = false;
let startupSent = false;
let reconnectTimer = null;

async function restoreSessionFromEnv() {
  if (!SESSION_ID) {
    console.log("⚠️ No SESSION_ID provided. QR will be generated.");
    return false;
  }

  try {
    let base64Data = SESSION_ID;

    if (SESSION_ID.includes(":~")) {
      base64Data = SESSION_ID.split(":~")[1];
    } else if (SESSION_ID.includes(":")) {
      base64Data = SESSION_ID.split(":")[1];
    }

    const decoded = Buffer.from(base64Data, "base64").toString("utf-8");
    const sessionData = JSON.parse(decoded);

    await fs.ensureDir(AUTH_DIR);

    if (sessionData.creds) {
      await fs.writeJson(path.join(AUTH_DIR, "creds.json"), sessionData.creds, { spaces: 2 });
      console.log("✅ creds.json restored");
    }

    for (const [key, value] of Object.entries(sessionData)) {
      if (key !== "creds" && typeof value === "object" && value !== null) {
        await fs.writeJson(path.join(AUTH_DIR, `${key}.json`), value, { spaces: 2 });
        console.log(`✅ ${key}.json restored`);
      }
    }

    console.log("✅ Session restored successfully from SESSION_ID");
    return true;
  } catch (err) {
    console.error("❌ Failed to restore SESSION_ID:", err.message);
    return false;
  }
}

async function loadCommands() {
  commands.clear();

  const commandsPath = path.join(__dirname, "../commands");

  if (!fs.existsSync(commandsPath)) {
    console.warn("⚠️ Commands folder not found:", commandsPath);
    return;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    try {
      const fullPath = path.join(commandsPath, file);
      delete require.cache[require.resolve(fullPath)];

      const cmd = require(fullPath);
      let commandName = path.basename(file, ".js");
      let executeFn = null;

      if (typeof cmd === "function") {
        executeFn = cmd;
      } else if (typeof cmd.execute === "function") {
        executeFn = cmd.execute;
        commandName = cmd.name || commandName;
      } else if (typeof cmd.run === "function") {
        executeFn = cmd.run;
        commandName = cmd.name || commandName;
      }

      if (executeFn) {
        commands.set(commandName.toLowerCase(), executeFn);
        console.log(`✅ Loaded command: ${commandName}`);
      } else {
        console.warn(`⚠️ Skipped command ${file}: no execute/run function`);
      }
    } catch (err) {
      console.error(`❌ Error loading command ${file}:`, err.message);
    }
  }

  console.log(`📦 Total commands loaded: ${commands.size}`);
}

function unwrapMessage(message) {
  if (!message) return null;

  if (message.ephemeralMessage?.message) {
    return unwrapMessage(message.ephemeralMessage.message);
  }

  if (message.viewOnceMessage?.message) {
    return unwrapMessage(message.viewOnceMessage.message);
  }

  if (message.viewOnceMessageV2?.message) {
    return unwrapMessage(message.viewOnceMessageV2.message);
  }

  return message;
}

function getMessageText(message) {
  const m = unwrapMessage(message);

  if (!m) return "";

  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.buttonsResponseMessage?.selectedButtonId ||
    m.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.templateButtonReplyMessage?.selectedId ||
    ""
  );
}

async function sendStartupMessage(sock) {
  if (startupSent) return;

  try {
    const botJid = jidNormalizedUser(sock.user.id);

    const message =
      `🤖 *${BOT_NAME}* is now ONLINE! ✅\n\n` +
      `⚡ Prefix: ${PREFIX}\n` +
      `📦 Commands: ${commands.size}\n\n` +
      `📱 Host Number: ${botJid.split("@")[0]}\n` +
      `💡 Startup alert sent only to the bot host inbox.`;

    await sock.sendMessage(botJid, { text: message });

    startupSent = true;
    console.log("📨 Startup message sent to bot host number");
  } catch (err) {
    console.log("⚠️ Could not send startup message:", err.message);
  }
}

async function connect() {
  if (isConnecting) {
    console.log("⏳ Connection already running. Skipping duplicate connect.");
    return;
  }

  isConnecting = true;

  await restoreSessionFromEnv();
  await loadCommands();

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: Pino({ level: "silent" }),

    browser: ["Ubuntu", "Chrome", "20.0.04"],

    markOnlineOnConnect: false,
    syncFullHistory: false,
    emitOwnEvents: false,
    fireInitQueries: true,
    generateHighQualityLinkPreview: false,

    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 30000,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("🔐 Scan QR in WhatsApp Linked Devices.");
    }

    if (connection === "open") {
      isConnecting = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      console.log(`✅ ${BOT_NAME} is ONLINE with ${commands.size} commands!`);
      await sendStartupMessage(sock);
    }

    if (connection === "close") {
      isConnecting = false;

      const code = lastDisconnect?.error?.output?.statusCode;
      console.log(`❌ Connection closed. Code: ${code}`);

      if (
        code === DisconnectReason.loggedOut ||
        code === 401 ||
        code === 403 ||
        code === 405
      ) {
        console.log("❌ Session rejected/invalid. Generate a fresh SESSION_ID.");
        process.exit(1);
      }

      if (reconnectTimer) return;

      console.log("🔄 Reconnecting in 10 seconds...");
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, 10000);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages?.[0];

      if (!msg?.message) return;
      if (msg.key.fromMe) return;

      const text = getMessageText(msg.message).trim();

      if (!text) return;
      if (!text.startsWith(PREFIX)) return;

      const args = text.slice(PREFIX.length).trim().split(/ +/).filter(Boolean);
      const commandName = args.shift()?.toLowerCase();

      if (!commandName) return;

      console.log(`📩 Command received: ${commandName}`);

      if (!commands.has(commandName)) {
        await sock.sendMessage(msg.key.remoteJid, {
          text: `❌ Unknown command: *${PREFIX}${commandName}*\n\nType *${PREFIX}menu* to see commands.`,
        });
        return;
      }

      const executeFn = commands.get(commandName);
      const context = {
        BOT_NAME,
        PREFIX,
        OWNER_NUMBER,
        COMMANDS_COUNT: commands.size,
      };

      await executeFn(sock, msg, args, context);
      console.log(`✅ Executed command: ${commandName}`);
    } catch (err) {
      console.error("❌ Message handler error:", err.message);
    }
  });
}

module.exports = connect;
