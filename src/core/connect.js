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
let onlineInterval = null;

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

    console.log("✅ Session restored");
    return true;
  } catch (err) {
    console.log("❌ Session restore failed:", err.message);
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

      if (fn) {
        commands.set(name.toLowerCase(), fn);
        console.log(`✅ Loaded command: ${name}`);
      }
    } catch (err) {
      console.log("❌ Command load error:", file, err.message);
    }
  }

  console.log(`📦 Loaded commands: ${commands.size}`);
}

function unwrapMessage(message) {
  if (!message) return null;
  if (message.ephemeralMessage?.message) return unwrapMessage(message.ephemeralMessage.message);
  if (message.viewOnceMessage?.message) return unwrapMessage(message.viewOnceMessage.message);
  if (message.viewOnceMessageV2?.message) return unwrapMessage(message.viewOnceMessageV2.message);
  if (message.documentWithCaptionMessage?.message) return unwrapMessage(message.documentWithCaptionMessage.message);
  return message;
}

function getMessageText(msg) {
  const m = unwrapMessage(msg);

  return (
    m?.conversation ||
    m?.extendedTextMessage?.text ||
    m?.imageMessage?.caption ||
    m?.videoMessage?.caption ||
    m?.buttonsResponseMessage?.selectedButtonId ||
    m?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m?.templateButtonReplyMessage?.selectedId ||
    ""
  );
}

function getSenderNumber(msg) {
  const jid = msg.key.participant || msg.key.remoteJid || "";
  return jid.split("@")[0].split(":")[0];
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
  } catch (err) {
    console.log("⚠️ Startup message failed:", err.message);
  }
}

async function startAlwaysOnline(sock) {
  if (onlineInterval) clearInterval(onlineInterval);

  const run = async () => {
    try {
      const settings = await readSettings();

      if (settings.alwaysonline) {
        await sock.sendPresenceUpdate("available").catch(() => {});
      } else {
        await sock.sendPresenceUpdate("unavailable").catch(() => {});
      }
    } catch {}
  };

  await run();
  onlineInterval = setInterval(run, 60 * 1000);
}

async function handleAutoStatus(sock, msg, settings) {
  if (msg.key.remoteJid !== "status@broadcast") return false;

  if (settings.autoviewstatus) {
    await sock.readMessages([msg.key]).catch(() => {});
    console.log("👁️ Auto viewed status");
  }

  if (settings.autoreactstatus) {
    await sock
      .sendMessage("status@broadcast", {
        react: {
          text: settings.setstatusemoji || "🔥",
          key: msg.key,
        },
      })
      .catch(() => {});

    console.log("🔥 Auto reacted to status");
  }

  return true;
}

async function handleAutoModeration(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) return false;

  const settings = await getGroupSettings(jid);
  const text = getMessageText(msg.message).toLowerCase();

  if (settings.antilink && (text.includes("chat.whatsapp.com") || text.includes("http"))) {
    await sock.sendMessage(jid, { delete: msg.key }).catch(() => {});
    await sock.sendMessage(jid, { text: "🚫 Link deleted" }).catch(() => {});
    return true;
  }

  if (settings.antibadword) {
    const badWords = settings.badwords || ["fuck", "shit", "bitch"];
    if (badWords.some((w) => text.includes(String(w).toLowerCase()))) {
      await sock.sendMessage(jid, { delete: msg.key }).catch(() => {});
      await sock.sendMessage(jid, { text: "🚫 Bad word removed" }).catch(() => {});
      return true;
    }
  }

  if (settings.antisticker && msg.message?.stickerMessage) {
    await sock.sendMessage(jid, { delete: msg.key }).catch(() => {});
    return true;
  }

  return false;
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
    browser: ["Lite-Ollver-MD", "Chrome", "1.0.0"],
    markOnlineOnConnect: false,
    syncFullHistory: true,
    emitOwnEvents: true,
    fireInitQueries: true,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      isConnecting = false;
      console.log("✅ Connected");

      await sendStartupMessage(sock);
      await startAlwaysOnline(sock);

      const settings = await readSettings();

      if (settings.autobio) {
        await sock.updateProfileStatus("Lite-Ollver-MD • Online").catch(() => {});
      }
    }

    if (connection === "close") {
      isConnecting = false;
      if (onlineInterval) clearInterval(onlineInterval);
      setTimeout(connect, 10000);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    try {
      const msg = messages?.[0];
      if (!msg?.key) return;

      if (msg.key.id) messageStore.set(msg.key.id, msg);
      if (!msg.message) return;

      console.log(`📥 Message event: ${type || "unknown"} | ${msg.key.remoteJid}`);

      const settings = await readSettings();

      if (await handleAutoStatus(sock, msg, settings)) return;

      if (settings.antiviewonce && msg.message?.viewOnceMessage) {
        const inner = msg.message.viewOnceMessage.message;
        await sock.sendMessage(msg.key.remoteJid, inner).catch(() => {});
        return;
      }

      if (settings.autoread) {
        await sock.readMessages([msg.key]).catch(() => {});
      }

      if (settings.autotype) {
        await sock.sendPresenceUpdate("composing", msg.key.remoteJid).catch(() => {});
      }

      if (settings.autorecord || settings.autorecordtyping) {
        await sock.sendPresenceUpdate("recording", msg.key.remoteJid).catch(() => {});
      }

      if (settings.autoreact && !msg.key.fromMe) {
        await sock
          .sendMessage(msg.key.remoteJid, {
            react: {
              text: settings.setstatusemoji || "✅",
              key: msg.key,
            },
          })
          .catch(() => {});
      }

      const stopped = await handleAutoModeration(sock, msg);
      if (stopped) return;

      const prefix = settings.prefix || DEFAULT_PREFIX;
      const mode = settings.mode || "public";

      const text = getMessageText(msg.message).trim();
      if (!text.startsWith(prefix)) return;

      const sender = getSenderNumber(msg);
      const isOwner = sender === OWNER_NUMBER;

      if (mode === "private" && !isOwner) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: "🔒 Bot is currently in private mode.",
        });
      }

      const args = text.slice(prefix.length).trim().split(/ +/).filter(Boolean);
      const cmdName = args.shift()?.toLowerCase();

      if (!cmdName) return;

      console.log("📌 Command:", cmdName);

      if (!commands.has(cmdName)) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: `❌ Unknown command.\n\nType *${prefix}menu*`,
        });
      }

      await commands.get(cmdName)(sock, msg, args, {
        BOT_NAME,
        PREFIX: prefix,
        OWNER_NUMBER,
        MODE: mode,
        COMMANDS_COUNT: commands.size,
        COMMAND_NAMES: [...commands.keys()],
      });

      console.log("✅ Command executed:", cmdName);
    } catch (err) {
      console.log("❌ Message error:", err.message);
    }
  });

  sock.ev.on("messages.delete", async ({ keys }) => {
    try {
      const settings = await readSettings();
      if (!settings.antidelete) return;

      for (const key of keys) {
        const msg = messageStore.get(key.id);
        if (!msg?.message) continue;

        await sock.sendMessage(key.remoteJid, {
          text: "🚫 Deleted message recovered:\n\n" + getMessageText(msg.message),
        });
      }
    } catch (err) {
      console.log("❌ Antidelete error:", err.message);
    }
  });
}

module.exports = connect;
