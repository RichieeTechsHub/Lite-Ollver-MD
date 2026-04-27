require("dotenv").config();

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  jidNormalizedUser,
} = require("@whiskeysockets/baileys");

const fs = require("fs-extra");
const path = require("path");
const Pino = require("pino");

const { getGroupSettings } = require("../lib/groupUtils");
const { readSettings } = require("../lib/botSettings");

const BOT_NAME = process.env.BOT_NAME || "Lite-Ollver-MD";
const DEFAULT_PREFIX = process.env.PREFIX || ".";
const OWNER_NUMBER = process.env.OWNER_NUMBER || "254740479599";
const SESSION_ID = process.env.SESSION_ID || "";
const AUTH_DIR = path.join(__dirname, "../auth_info");

let commands = new Map();
let isConnecting = false;
let startupSent = false;

async function restoreSessionFromEnv() {
  if (!SESSION_ID) return false;

  try {
    let base64Data = SESSION_ID;
    if (SESSION_ID.includes(":~")) base64Data = SESSION_ID.split(":~")[1];
    else if (SESSION_ID.includes(":")) base64Data = SESSION_ID.split(":")[1];

    const sessionData = JSON.parse(Buffer.from(base64Data, "base64").toString("utf-8"));
    await fs.ensureDir(AUTH_DIR);

    if (sessionData.creds) await fs.writeJson(path.join(AUTH_DIR, "creds.json"), sessionData.creds);

    for (const [key, value] of Object.entries(sessionData)) {
      if (key !== "creds" && typeof value === "object") {
        await fs.writeJson(path.join(AUTH_DIR, `${key}.json`), value);
      }
    }

    return true;
  } catch {
    return false;
  }
}

async function loadCommands() {
  commands.clear();

  const commandsPath = path.join(__dirname, "../commands");
  if (!fs.existsSync(commandsPath)) return;

  const files = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

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
      }

      if (fn) commands.set(name.toLowerCase(), fn);
    } catch (err) {
      console.log("Command load error:", file, err.message);
    }
  }

  console.log(`📦 Total commands: ${commands.size}`);
}

function getMessageText(msg) {
  return (
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.imageMessage?.caption ||
    msg.videoMessage?.caption ||
    ""
  );
}

function getSenderNumber(msg) {
  const jid = msg.key.participant || msg.key.remoteJid || "";
  return jid.split("@")[0].split(":")[0];
}

async function deleteMessage(sock, msg) {
  try {
    await sock.sendMessage(msg.key.remoteJid, { delete: msg.key });
  } catch {}
}

async function handleAutoModeration(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) return false;

  const settings = await getGroupSettings(jid);
  const text = getMessageText(msg.message).toLowerCase();

  if (settings.antilink && (text.includes("chat.whatsapp.com") || text.includes("http"))) {
    await deleteMessage(sock, msg);
    await sock.sendMessage(jid, { text: "🚫 Link detected & deleted." });
    return true;
  }

  if (settings.antibadword) {
    const badWords = settings.badwords || ["fuck", "shit", "bitch"];
    if (badWords.some((w) => text.includes(String(w).toLowerCase()))) {
      await deleteMessage(sock, msg);
      await sock.sendMessage(jid, { text: "🚫 Bad word removed." });
      return true;
    }
  }

  if (settings.antisticker && msg.message?.stickerMessage) {
    await deleteMessage(sock, msg);
    await sock.sendMessage(jid, { text: "🚫 Stickers not allowed." });
    return true;
  }

  return false;
}

async function sendStartupMessage(sock) {
  if (startupSent) return;

  try {
    const botJid = jidNormalizedUser(sock.user.id);
    const settings = await readSettings();
    const prefix = settings.prefix || DEFAULT_PREFIX;
    const mode = settings.mode || "public";

    await sock.sendMessage(botJid, {
      text:
        `🤖 *${BOT_NAME}* ONLINE\n\n` +
        `⚡ Prefix: ${prefix}\n` +
        `🔐 Mode: ${mode}\n` +
        `📦 Commands: ${commands.size}`,
    });

    startupSent = true;
  } catch {}
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
    syncFullHistory: true,
    emitOwnEvents: true,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      isConnecting = false;
      console.log("✅ Bot connected");
      await sendStartupMessage(sock);
    }

    if (connection === "close") {
      isConnecting = false;
      setTimeout(connect, 10000);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0];
      if (!msg?.message) return;

      const stopped = await handleAutoModeration(sock, msg);
      if (stopped) return;

      const settings = await readSettings();
      const prefix = settings.prefix || DEFAULT_PREFIX;
      const mode = settings.mode || "public";

      const text = getMessageText(msg.message).trim();
      if (!text.startsWith(prefix)) return;

      const senderNumber = getSenderNumber(msg);
      const isOwner = senderNumber === OWNER_NUMBER;

      if (mode === "private" && !isOwner) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: "🔒 Bot is currently in private mode.",
        });
      }

      const args = text.slice(prefix.length).trim().split(/ +/).filter(Boolean);
      const commandName = args.shift()?.toLowerCase();

      if (!commandName) return;

      if (!commands.has(commandName)) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: `❌ Unknown command.\n\nType *${prefix}menu*`,
        });
      }

      await commands.get(commandName)(sock, msg, args, {
        BOT_NAME,
        PREFIX: prefix,
        OWNER_NUMBER,
        MODE: mode,
        COMMANDS_COUNT: commands.size,
        COMMAND_NAMES: [...commands.keys()],
      });
    } catch (err) {
      console.log("❌ Message error:", err.message);
    }
  });
}

module.exports = connect;
