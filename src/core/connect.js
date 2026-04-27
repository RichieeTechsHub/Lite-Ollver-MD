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
  if (!SESSION_ID) return false;

  try {
    let base64Data = SESSION_ID;

    if (SESSION_ID.includes(":~")) base64Data = SESSION_ID.split(":~")[1];
    else if (SESSION_ID.includes(":")) base64Data = SESSION_ID.split(":")[1];

    const sessionData = JSON.parse(Buffer.from(base64Data, "base64").toString("utf-8"));

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

  const files = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  for (const file of files) {
    try {
      const fullPath = path.join(commandsPath, file);
      delete require.cache[require.resolve(fullPath)];

      const cmd = require(fullPath);
      let name = path.basename(file, ".js");
      let fn = null;

      if (typeof cmd === "function") fn = cmd;
      else if (typeof cmd.execute === "function") {
        fn = cmd.execute;
        name = cmd.name || name;
      } else if (typeof cmd.run === "function") {
        fn = cmd.run;
        name = cmd.name || name;
      }

      if (fn) {
        commands.set(name.toLowerCase(), fn);
        console.log(`✅ Loaded command: ${name}`);
      }
    } catch (err) {
      console.error(`❌ Error loading command ${file}:`, err.message);
    }
  }

  console.log(`📦 Total commands loaded: ${commands.size}`);
}

function unwrapMessage(message) {
  if (!message) return null;
  if (message.ephemeralMessage?.message) return unwrapMessage(message.ephemeralMessage.message);
  if (message.viewOnceMessage?.message) return unwrapMessage(message.viewOnceMessage.message);
  if (message.viewOnceMessageV2?.message) return unwrapMessage(message.viewOnceMessageV2.message);
  if (message.documentWithCaptionMessage?.message) return unwrapMessage(message.documentWithCaptionMessage.message);
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

    await sock.sendMessage(botJid, {
      text:
        `🤖 *${BOT_NAME}* is now ONLINE! ✅\n\n` +
        `⚡ Prefix: ${PREFIX}\n` +
        `📦 Commands: ${commands.size}\n\n` +
        `📱 Host Number: ${botJid.split("@")[0]}`,
    });

    startupSent = true;
    console.log("📨 Startup message sent to bot host number");
  } catch (err) {
    console.log("⚠️ Could not send startup message:", err.message);
  }
}

async function connect() {
  if (isConnecting) return;

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
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: false,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 30000,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    console.log(`📥 messages.upsert fired. Type: ${type}, Count: ${messages?.length || 0}`);

    try {
      const msg = messages?.[0];

      if (!msg) {
        console.log("⚠️ No message object received");
        return;
      }

      const remoteJid = msg.key?.remoteJid || "unknown";
      const fromMe = !!msg.key?.fromMe;
      const messageType = msg.message ? Object.keys(msg.message)[0] : "no-message";

      console.log(`📩 Raw message | From: ${remoteJid} | FromMe: ${fromMe} | Type: ${messageType}`);

      if (!msg.message) return;

      const text = getMessageText(msg.message).trim();

      console.log(`📝 Extracted text: "${text}"`);

      if (!text) return;
      if (!text.startsWith(PREFIX)) return;

      const args = text.slice(PREFIX.length).trim().split(/ +/).filter(Boolean);
      const commandName = args.shift()?.toLowerCase();

      console.log(`📌 Command parsed: ${commandName}`);

      if (!commandName) return;

      if (!commands.has(commandName)) {
        console.log(`❌ Unknown command: ${commandName}`);
        await sock.sendMessage(remoteJid, {
          text: `❌ Unknown command: *${PREFIX}${commandName}*\n\nType *${PREFIX}menu*`,
        });
        return;
      }

      const executeFn = commands.get(commandName);

      await executeFn(sock, msg, args, {
        BOT_NAME,
        PREFIX,
        OWNER_NUMBER,
        COMMANDS_COUNT: commands.size,
        COMMAND_NAMES: [...commands.keys()],
      });

      console.log(`✅ Executed command: ${commandName}`);
    } catch (err) {
      console.error("❌ Message handler error:", err);
    }
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) console.log("🔐 Scan QR in WhatsApp Linked Devices.");

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

      if ([DisconnectReason.loggedOut, 401, 403, 405].includes(code)) {
        process.exit(1);
      }

      if (reconnectTimer) return;

      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, 10000);
    }
  });
}

module.exports = connect;
