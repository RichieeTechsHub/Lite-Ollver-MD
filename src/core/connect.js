require("dotenv").config();

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
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
      delete require.cache[require.resolve(path.join(commandsPath, file))];

      const cmd = require(path.join(commandsPath, file));
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
      }
    } catch (err) {
      console.error(`❌ Error loading command ${file}:`, err.message);
    }
  }

  console.log(`📦 Total commands loaded: ${commands.size}`);
}

async function sendStartupMessage(sock) {
  if (startupSent) return;

  try {
    const ownerJid = `${OWNER_NUMBER}@s.whatsapp.net`;

    await sock.sendMessage(ownerJid, {
      text:
        `🤖 *${BOT_NAME}* is now ONLINE! ✅\n\n` +
        `⚡ Prefix: ${PREFIX}\n` +
        `📦 Commands: ${commands.size}\n` +
        `👑 Owner: wa.me/${OWNER_NUMBER}\n\n` +
        `Type *${PREFIX}menu* to see all commands.`,
    });

    startupSent = true;
    console.log("📨 Startup notification sent to owner");
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

      console.log("🔄 Reconnecting in 10 seconds...");
      setTimeout(connect, 10000);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0];

      if (!msg?.message || msg.key.fromMe) return;

      let text = "";

      if (msg.message.conversation) {
        text = msg.message.conversation;
      } else if (msg.message.extendedTextMessage?.text) {
        text = msg.message.extendedTextMessage.text;
      } else if (msg.message.imageMessage?.caption) {
        text = msg.message.imageMessage.caption;
      } else if (msg.message.videoMessage?.caption) {
        text = msg.message.videoMessage.caption;
      } else {
        return;
      }

      if (!text.startsWith(PREFIX)) return;

      const args = text.slice(PREFIX.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();

      if (!commandName || !commands.has(commandName)) return;

      const executeFn = commands.get(commandName);
      const context = { BOT_NAME, PREFIX, OWNER_NUMBER };

      await executeFn(sock, msg, args, context);
      console.log(`📝 Executed command: ${commandName}`);
    } catch (err) {
      console.error("❌ Message handler error:", err.message);
    }
  });
}

module.exports = connect;
