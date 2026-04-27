require("dotenv").config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const path = require("path");
const Pino = require("pino");

// Read config from env (no external file required)
const BOT_NAME = process.env.BOT_NAME || "Lite-Ollver-MD";
const PREFIX = process.env.PREFIX || ".";
const OWNER_NUMBER = process.env.OWNER_NUMBER || "254740479599";
const MODE = process.env.MODE || "public";

async function restoreSessionFromEnv() {
  const sessionString = process.env.SESSION_ID || "";
  if (!sessionString) {
    console.log("⚠️ No SESSION_ID – will generate QR code");
    return false;
  }
  let base64Data = sessionString.includes(":~") ? sessionString.split(":~")[1] : sessionString;
  try {
    const decoded = Buffer.from(base64Data, "base64").toString("utf-8");
    const sessionData = JSON.parse(decoded);
    const authDir = "./auth_info";
    await fs.ensureDir(authDir);
    if (sessionData.creds) await fs.writeJson(path.join(authDir, "creds.json"), sessionData.creds, { spaces: 2 });
    if (sessionData.keys) {
      for (const [keyName, keyValue] of Object.entries(sessionData.keys)) {
        let fileName = keyName.startsWith("pre-key-") ? `pre-key-${keyName.split("-")[2]}.json` : `${keyName}.json`;
        await fs.writeJson(path.join(authDir, fileName), keyValue, { spaces: 2 });
      }
    }
    console.log("✅ Session restored");
    return true;
  } catch (err) {
    console.error("Session restore failed:", err.message);
    return false;
  }
}

// Load commands from src/commands folder dynamically
async function loadCommands(sock) {
  const commandsPath = path.join(__dirname, "../commands");
  if (!fs.existsSync(commandsPath)) return;
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
  for (const file of files) {
    try {
      const cmd = require(path.join(commandsPath, file));
      // Attach to a global map or just log
      console.log(`Loaded command: ${path.basename(file, ".js")}`);
    } catch (err) {
      console.error(`Error loading ${file}:`, err.message);
    }
  }
}

async function connect() {
  await restoreSessionFromEnv();
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: Pino({ level: "silent" }),
    browser: ["Lite-Ollver-MD", "Chrome", "120.0.0.0"],
  });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") {
      console.log(`✅ ${BOT_NAME} is online!`);
      await loadCommands(sock); // load commands after login
    } else if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) process.exit(1);
      else connect();
    }
  });
  // Simple message handler that executes commands
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    let text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    if (!text.startsWith(PREFIX)) return;
    const args = text.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    // Dynamically require command file each time (or cache)
    try {
      const cmdPath = path.join(__dirname, "../commands", `${commandName}.js`);
      if (fs.existsSync(cmdPath)) {
        const cmd = require(cmdPath);
        if (typeof cmd === "function") await cmd(sock, msg, args, { BOT_NAME, PREFIX, OWNER_NUMBER, MODE });
        else if (cmd.execute) await cmd.execute(sock, msg, args, { BOT_NAME, PREFIX, OWNER_NUMBER, MODE });
        else console.log(`Command ${commandName} has no execute function`);
      }
    } catch (err) {
      console.error(`Command error ${commandName}:`, err.message);
    }
  });
}

module.exports = connect;
