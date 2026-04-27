require("dotenv").config();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs-extra");
const path = require("path");
const Pino = require("pino");

// ========== READ FROM ENV ==========
const BOT_NAME = process.env.BOT_NAME || "Lite-Ollver-MD";
const PREFIX = process.env.PREFIX || ".";
const OWNER_NUMBER = process.env.OWNER_NUMBER || "254740479599";

// ========== SESSION RESTORE ==========
async function restoreSession() {
    const sessionString = process.env.SESSION_ID || "";
    if (!sessionString) {
        console.log("⚠️ No SESSION_ID");
        return false;
    }
    
    // Extract Base64 part (remove prefix like "LITE-OLLVER-MD:~")
    let base64Part = sessionString;
    if (sessionString.includes(":~")) {
        base64Part = sessionString.split(":~")[1];
    } else if (sessionString.includes(":")) {
        base64Part = sessionString.split(":")[1];
    }
    
    try {
        // Decode Base64
        const decoded = Buffer.from(base64Part, "base64").toString("utf-8");
        const sessionData = JSON.parse(decoded);
        
        const authDir = "./auth_info";
        await fs.ensureDir(authDir);
        
        // Save creds.json
        if (sessionData.creds) {
            await fs.writeJson(path.join(authDir, "creds.json"), sessionData.creds, { spaces: 2 });
            console.log("✅ creds.json restored");
        }
        
        // Save all app-state-sync-key files
        for (const [key, value] of Object.entries(sessionData)) {
            if (key !== "creds" && typeof value === "object") {
                const filePath = path.join(authDir, `${key}.json`);
                await fs.writeJson(filePath, value, { spaces: 2 });
            }
        }
        
        console.log("✅ Session restored successfully");
        return true;
    } catch (err) {
        console.error("❌ Session restore failed:", err.message);
        return false;
    }
}

// ========== LOAD COMMANDS ==========
let commands = new Map();

async function loadCommands() {
    const cmdsPath = path.join(__dirname, "../commands");
    if (!fs.existsSync(cmdsPath)) return;
    
    const files = fs.readdirSync(cmdsPath).filter(f => f.endsWith(".js"));
    for (const file of files) {
        try {
            const cmd = require(path.join(cmdsPath, file));
            const name = path.basename(file, ".js");
            if (typeof cmd === "function") {
                commands.set(name, cmd);
            } else if (cmd.execute) {
                commands.set(name, cmd.execute);
            } else if (cmd.run) {
                commands.set(name, cmd.run);
            }
            console.log(`✅ Loaded: ${name}`);
        } catch (err) {
            console.error(`❌ Failed: ${file}`, err.message);
        }
    }
    console.log(`📦 Total: ${commands.size} commands`);
}

// ========== MAIN CONNECTION ==========
async function connect() {
    await restoreSession();
    await loadCommands();
    
    const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: Pino({ level: "info" }),
        browser: ["Lite-Ollver-MD", "Chrome", "1.0.0"]
    });
    
    sock.ev.on("creds.update", saveCreds);
    
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log("🔐 Scan QR if no session exists");
        }
        
        if (connection === "open") {
            console.log(`✅ ${BOT_NAME} ONLINE with ${commands.size} commands`);
            
            // Send startup message
            try {
                await sock.sendMessage(OWNER_NUMBER + "@s.whatsapp.net", {
                    text: `🤖 *${BOT_NAME}* connected!\nPrefix: ${PREFIX}\nCommands: ${commands.size}`
                });
                console.log("📨 Startup message sent");
            } catch (err) {
                console.log("⚠️ Could not send startup message:", err.message);
            }
        }
        
        if (connection === "close") {
            const code = lastDisconnect?.error?.output?.statusCode;
            if (code === DisconnectReason.loggedOut) {
                console.log("❌ Logged out");
                process.exit(1);
            } else {
                console.log("🔄 Reconnecting...");
                setTimeout(() => connect(), 3000);
            }
        }
    });
    
    // Message handler
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        let text = "";
        if (msg.message.conversation) text = msg.message.conversation;
        else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
        else return;
        
        if (!text.startsWith(PREFIX)) return;
        
        const args = text.slice(PREFIX.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();
        
        if (commands.has(cmdName)) {
            try {
                await commands.get(cmdName)(sock, msg, args, { BOT_NAME, PREFIX, OWNER_NUMBER });
                console.log(`✅ Command: ${cmdName}`);
            } catch (err) {
                console.error(`❌ ${cmdName}:`, err.message);
                await sock.sendMessage(msg.key.remoteJid, { text: "❌ Command failed" });
            }
        }
    });
}

module.exports = connect;
