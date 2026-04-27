require("dotenv").config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const path = require("path");
const Pino = require("pino");

// === CONFIGURATION FROM ENVIRONMENT ===
const BOT_NAME = process.env.BOT_NAME || "Lite-Ollver-MD";
const PREFIX = process.env.PREFIX || ".";
const OWNER_NUMBER = process.env.OWNER_NUMBER || "254740479599";
const MODE = process.env.MODE || "public";
const SESSION_ID = process.env.SESSION_ID || "";

// === SESSION RESTORE FUNCTION ===
async function restoreSessionFromEnv() {
  if (!SESSION_ID) {
    console.log("⚠️ No SESSION_ID provided – will generate QR code on first run.");
    return false;
  }

  let base64Data = SESSION_ID;
  if (SESSION_ID.includes(":~")) {
    base64Data = SESSION_ID.split(":~")[1];
  } else if (SESSION_ID.includes(":")) {
    base64Data = SESSION_ID.split(":")[1];
  }

  try {
    const decoded = Buffer.from(base64Data, "base64").toString("utf-8");
    const sessionData = JSON.parse(decoded);
    const authDir = "./auth_info";

    await fs.ensureDir(authDir);

    // Write creds.json
    if (sessionData.creds) {
      await fs.writeJson(path.join(authDir, "creds.json"), sessionData.creds, { spaces: 2 });
    }

    // Write app-state-sync-key-*.json files
    if (sessionData.keys && typeof sessionData.keys === "object") {
      for (const [keyName, keyValue] of Object.entries(sessionData.keys)) {
        let fileName;
        if (keyName.startsWith("pre-key-")) {
          fileName = `pre-key-${keyName.split("-")[2]}.json`;
        } else {
          fileName = `${keyName}.json`;
        }
        await fs.writeJson(path.join(authDir, fileName), keyValue, { spaces: 2 });
      }
    }

    console.log("✅ Session restored from SESSION_ID");
    return true;
  } catch (err) {
    console.error("❌ Failed to restore session:", err.message);
    return false;
  }
}

// === DYNAMIC COMMAND LOADER (caches commands) ===
let commands = new Map();

async function loadCommands() {
  const commandsPath = path.join(__dirname, "../commands");
  if (!fs.existsSync(commandsPath)) {
    console.warn("⚠️ Commands folder not found:", commandsPath);
    return;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
  for (const file of commandFiles) {
    try {
      const cmd = require(path.join(commandsPath, file));
      let commandName = path.basename(file, ".js");
      let executeFn = null;

      // Detect different export patterns
      if (typeof cmd === "function") {
        executeFn = cmd;
      } else if (cmd.execute && typeof cmd.execute === "function") {
        executeFn = cmd.execute;
        commandName = cmd.name || commandName;
      } else if (cmd.run && typeof cmd.run === "function") {
        executeFn = cmd.run;
        commandName = cmd.name || commandName;
      } else if (cmd.default && typeof cmd.default === "function") {
        executeFn = cmd.default;
      }

      if (executeFn) {
        commands.set(commandName, executeFn);
        console.log(`✅ Loaded command: ${commandName}`);
      } else {
        console.warn(`⚠️ Skipping ${file}: no executable function found`);
      }
    } catch (err) {
      console.error(`❌ Error loading command ${file}:`, err.message);
    }
  }
  console.log(`📦 Total commands loaded: ${commands.size}`);
}

// === MAIN CONNECTION FUNCTION ===
async function connect() {
  await restoreSessionFromEnv();
  await loadCommands();

  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: Pino({ level: "silent" }),
    browser: ["Lite-Ollver-MD", "Chrome", "120.0.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("🔐 Scan this QR code with WhatsApp (if no existing session):");
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log("❌ Session logged out. Delete auth_info folder and restart.");
        process.exit(1);
      } else {
        console.log("🔄 Connection closed, reconnecting...");
        connect();
      }
    } else if (connection === "open") {
      console.log(`✅ ${BOT_NAME} is online with ${commands.size} commands!`);

      // === SEND STARTUP MESSAGE TO OWNER ===
      try {
        const ownerJid = OWNER_NUMBER + "@s.whatsapp.net";
        const startupText = `🤖 *${BOT_NAME}* connected successfully! ✅\n\n⚡ Prefix: ${PREFIX}\n🌍 Mode: ${MODE}\n📦 Commands: ${commands.size}\n\nType *${PREFIX}menu* to get started.`;
        await sock.sendMessage(ownerJid, { text: startupText });
        console.log("📨 Startup notification sent to owner.");
      } catch (err) {
        console.log("⚠️ Could not send startup message to owner:", err.message);
      }
    }
  });

  // === MESSAGE HANDLER (EXECUTES COMMANDS) ===
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    // Extract text from different message types
    let text = "";
    if (msg.message.conversation) text = msg.message.conversation;
    else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
    else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption;
    else if (msg.message.videoMessage?.caption) text = msg.message.videoMessage.caption;
    else return;

    if (!text.startsWith(PREFIX)) return;

    const args = text.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commands.has(commandName)) {
      try {
        const executeFn = commands.get(commandName);
        const context = { BOT_NAME, PREFIX, OWNER_NUMBER, MODE };
        await executeFn(sock, msg, args, context);
        console.log(`📝 Executed command: ${commandName}`);
      } catch (err) {
        console.error(`❌ Error executing command ${commandName}:`, err.message);
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Command failed. Check logs." });
      }
    } else {
      // Optional: reply that command doesn't exist
      // await sock.sendMessage(msg.key.remoteJid, { text: `Unknown command. Try ${PREFIX}menu` });
    }
  });
}

module.exports = connect;
