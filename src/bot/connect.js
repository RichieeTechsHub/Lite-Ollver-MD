const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")

async function startBot() {

const { state, saveCreds } = await useMultiFileAuthState("./session")

const sock = makeWASocket({
logger: pino({ level: "silent" }),
auth: state,
printQRInTerminal: false
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => {

const { connection } = update

if (connection === "open") {

console.log("✅ Lite-Ollver-MD connected successfully")

}

})

sock.ev.on("messages.upsert", async (m) => {

const msg = m.messages[0]

if (!msg.message) return
if (msg.key.fromMe) return

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
""

const from = msg.key.remoteJid

if (text === ".menu") {

await sock.sendMessage(from, {
text: "🔥 Lite-Ollver-MD is working!\n\nCommands:\n.menu\n.ping"
})

}

if (text === ".ping") {

await sock.sendMessage(from, {
text: "🏓 Pong! Bot is alive."
})

}

})

}

module.exports = startBot
