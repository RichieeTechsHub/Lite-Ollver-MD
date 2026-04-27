require("dotenv").config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const path = require("path");
const Pino = require("pino");

// ========== CONFIG FROM ENV ==========
const BOT_NAME = process.env.BOT_NAME || "Lite-Ollver-MD";
const PREFIX = process.env.PREFIX || ".";
const OWNER_NUMBER = process.env.OWNER_NUMBER || "254740479599";
const SESSION_ID = process.env.SESSION_ID || "";

// ========== SESSION RESTORE FUNCTION ==========
async function restoreSessionFromEnv() {
  if (!SESSION_ID) {
    console.log("⚠️ No SESSION_ID provided – will generate QR code on first run.");
    return false;
  }

  // Extract Base64 part (remove prefix like "LITE-OLLVER-MD:~")
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
      console.log("✅ creds.json restored");
    }

    // Write all app-state-sync-key files
    for (const [key, value] of Object.entries(sessionData)) {
      if (key !== "creds" && typeof value === "object" && value !== null) {
        const filePath = path.join(authDir, `${key}.json`);
        await fs.writeJson(filePath, value, { spaces: 2 });
        console.log(`✅ ${key}.json restored`);
      }
    }

    console.log("✅ Session restored successfully from SESSION_ID");
    return true;
  } catch (err) {
    console.error("❌ Failed to restore session:", err.message);
    return false;
  }
}

// ========== DYNAMIC COMMAND LOADER ==========
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

// ========== SEND STARTUP MESSAGE ==========
async function sendStartupMessage(sock) {
  try {
    const ownerJid = OWNER_NUMBER + "@s.whatsapp.net";
    const message = `🤖 *${BOT_NAME}* is now ONLINE! ✅\n\n⚡ Prefix: ${PREFIX}\n📦 Commands: ${commands.size}\n👑 Owner: wa.me/${OWNER_NUMBER}\n\nType *${PREFIX}menu* to see all commands.`;
    await sock.sendMessage(ownerJid, { text: message });
    console.log("📨 Startup notification sent to owner");
  } catch (err) {
    console.log("⚠️ Could not send startup message:", err.message);
  }
}

// ========== MAIN CONNECTION FUNCTION ==========
async function connect() {
  await restoreSessionFromEnv();
  await loadCommands();

  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: Pino({ level: "info" }),
    browser: ["Lite-Ollver-MD", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("🔐 Scan this QR code with WhatsApp (if no session exists):");
    }

    if (connection === "open") {
      console.log(`✅ ${BOT_NAME} is ONLINE with ${commands.size} commands!`);
      await sendStartupMessage(sock);
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        console.log("❌ Session logged out. Delete auth_info folder and restart.");
        process.exit(1);
      } else {
        console.log(`🔄 Connection closed (${code}), reconnecting in 5 seconds...`);
        setTimeout(() => connect(), 5000);
      }
    }
  });

  // ========== MESSAGE HANDLER ==========
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
        const context = { BOT_NAME, PREFIX, OWNER_NUMBER };
        await executeFn(sock, msg, args, context);
        console.log(`📝 Executed command: ${commandName}`);
      } catch (err) {
        console.error(`❌ Error executing command ${commandName}:`, err.message);
        await sock.sendMessage(msg.key.remoteJid, { text: "❌ Command failed. Check logs." });
      }
    }
  });
}

module.exports = connect;
