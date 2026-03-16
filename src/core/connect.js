const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { handleMessages } = require("./handler");
const config = require("../../config");

async function connect() {
  console.log("📁 Loading session from ./session folder...");
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: Browsers.appositium(config.BOT_NAME),
    markOnlineOnConnect: true,
    syncFullHistory: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "connecting") console.log("🔄 Connecting to WhatsApp...");
    if (connection === "open") console.log("✅ Connected successfully!");
    if (connection === "close") {
      console.log("❌ Connection closed:", lastDisconnect?.error?.message);
      setTimeout(connect, 5000);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const msg = messages[0];
    if (!msg?.message) return;
    await handleMessages(sock, msg);
  });

  return sock;
}

module.exports = connect;