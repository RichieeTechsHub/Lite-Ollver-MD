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

// store deleted messages
const messageStore = new Map();

async function restoreSessionFromEnv() {
  if (!SESSION_ID) return false;

  try {
    let base64Data = SESSION_ID;

    if (SESSION_ID.includes(":~")) base64Data = SESSION_ID.split(":~")[1];
    else if (SESSION_ID.includes(":")) base64Data = SESSION_ID.split(":")[1];

    const sessionData = JSON.parse(Buffer.from(base64Data, "base64").toString("utf-8"));

    await fs.ensureDir(AUTH_DIR);

    if (sessionData.creds) {
      await fs.writeJson(path.join(AUTH_DIR, "creds.json"), sessionData.creds);
    }

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

  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

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

    } catch {}
  }

  console.log(`📦 Loaded commands: ${commands.size}`);
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

// 🔥 GROUP MODERATION BACK
async function handleAutoModeration(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) return false;

  const settings = await getGroupSettings(jid);
  const text = getMessageText(msg.message).toLowerCase();

  if (settings.antilink && (text.includes("chat.whatsapp.com") || text.includes("http"))) {
    await sock.sendMessage(jid, { delete: msg.key });
    await sock.sendMessage(jid, { text: "🚫 Link deleted" });
    return true;
  }

  if (settings.antibadword) {
    const badWords = ["fuck", "shit", "bitch"];
    if (badWords.some(w => text.includes(w))) {
      await sock.sendMessage(jid, { delete: msg.key });
      await sock.sendMessage(jid, { text: "🚫 Bad word removed" });
      return true;
    }
  }

  if (settings.antisticker && msg.message?.stickerMessage) {
    await sock.sendMessage(jid, { delete: msg.key });
    return true;
  }

  return false;
}

// 🔥 STATUS HANDLER
async function handleAutoStatus(sock, msg, settings) {
  if (msg.key.remoteJid !== "status@broadcast") return false;

  if (settings.autoviewstatus) {
    await sock.readMessages([msg.key]).catch(() => {});
  }

  if (settings.autoreactstatus) {
    await sock.sendMessage("status@broadcast", {
      react: { text: settings.setstatusemoji || "🔥", key: msg.key }
    }).catch(() => {});
  }

  return true;
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
  });

  sock.ev.on("creds.update", saveCreds);

  // 🔥 STORE MESSAGES (for antidelete)
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg?.key) return;

    messageStore.set(msg.key.id, msg);
  });

  // 🔥 ANTIDELETE
  sock.ev.on("messages.delete", async ({ keys }) => {
    const settings = await readSettings();
    if (!settings.antidelete) return;

    for (const key of keys) {
      const msg = messageStore.get(key.id);
      if (!msg) continue;

      await sock.sendMessage(key.remoteJid, {
        text: "🚫 Deleted message recovered:\n\n" + getMessageText(msg.message)
      });
    }
  });

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      console.log("✅ Connected");

      const settings = await readSettings();

      if (settings.alwaysonline) {
        await sock.sendPresenceUpdate("available").catch(() => {});
      }

      if (settings.autobio) {
        await sock.updateProfileStatus("Lite-Ollver-MD • Online").catch(() => {});
      }
    }

    if (connection === "close") {
      setTimeout(connect, 10000);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0];
      if (!msg?.message) return;

      const settings = await readSettings();

      // STATUS
      if (await handleAutoStatus(sock, msg, settings)) return;

      // VIEW ONCE BYPASS
      if (settings.antiviewonce && msg.message?.viewOnceMessage) {
        const inner = msg.message.viewOnceMessage.message;
        await sock.sendMessage(msg.key.remoteJid, inner);
        return;
      }

      if (settings.autoread) {
        await sock.readMessages([msg.key]);
      }

      if (settings.autotype) {
        await sock.sendPresenceUpdate("composing", msg.key.remoteJid);
      }

      if (settings.autorecord) {
        await sock.sendPresenceUpdate("recording", msg.key.remoteJid);
      }

      if (settings.autoreact && !msg.key.fromMe) {
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: settings.setstatusemoji || "✅", key: msg.key }
        });
      }

      const stopped = await handleAutoModeration(sock, msg);
      if (stopped) return;

      const prefix = settings.prefix || DEFAULT_PREFIX;
      const mode = settings.mode || "public";

      const text = getMessageText(msg.message);
      if (!text.startsWith(prefix)) return;

      const sender = getSenderNumber(msg);
      const isOwner = sender === OWNER_NUMBER;

      if (mode === "private" && !isOwner) return;

      const args = text.slice(prefix.length).trim().split(" ");
      const cmdName = args.shift().toLowerCase();

      if (!commands.has(cmdName)) return;

      await commands.get(cmdName)(sock, msg, args, {
        BOT_NAME,
        PREFIX: prefix,
        OWNER_NUMBER,
      });

    } catch (err) {
      console.log("❌ Error:", err.message);
    }
  });
}

module.exports = connect;
