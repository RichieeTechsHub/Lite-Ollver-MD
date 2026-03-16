const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    markOnlineOnConnect: true,
    syncFullHistory: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "connecting") {
      console.log("🔄 Connecting...");
    }

    if (connection === "open") {
      console.log("✅ Connected successfully");
    }

    if (connection === "close") {
      console.log("❌ Connection closed");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    try {
      console.log("📨 messages.upsert type:", type);

      const msg = messages?.[0];
      if (!msg) return;

      console.log("📩 Full incoming message:", JSON.stringify(msg, null, 2));

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        "";

      if (!text) return;

      const from = msg.key.remoteJid;
      console.log("✅ Incoming text:", text);

      if (text === ".ping") {
        await sock.sendMessage(from, { text: "🏓 Pong!" }, { quoted: msg });
      }

      if (text === ".menu") {
        await sock.sendMessage(
          from,
          { text: "🔥 Lite-Ollver-MD working.\n\nCommands:\n.ping\n.menu" },
          { quoted: msg }
        );
      }
    } catch (err) {
      console.error("❌ Message handler error:", err.message);
    }
  });
}

module.exports = startBot;
