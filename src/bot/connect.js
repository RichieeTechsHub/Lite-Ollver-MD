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
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;

    if (connection === "connecting") {
      console.log("🔄 Connecting Lite-Ollver-MD to WhatsApp...");
    }

    if (connection === "open") {
      console.log("✅ Lite-Ollver-MD connected successfully.");

      try {
        const myJid = sock.user?.id;
        if (myJid) {
          await sock.sendMessage(myJid, {
            text: "✅ Lite-Ollver-MD is online.\nTry: .ping or .menu"
          });
          console.log("✅ Startup message sent successfully");
        }
      } catch (e) {
        console.log("⚠️ Startup message failed:", e.message);
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages?.[0];
      if (!msg || !msg.message) return;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption ||
        "";

      if (!text) return;

      const from = msg.key.remoteJid;
      console.log(`📩 Incoming: ${text} | fromMe=${msg.key.fromMe} | chat=${from}`);

      if (text === ".ping") {
        await sock.sendMessage(
          from,
          { text: "🏓 Pong! Bot is alive." },
          { quoted: msg }
        );
        return;
      }

      if (text === ".menu") {
        await sock.sendMessage(
          from,
          {
            text:
              "🔥 *Lite-Ollver-MD is working!*\n\n" +
              "Commands:\n" +
              ".menu\n" +
              ".ping\n" +
              ".alive\n" +
              ".owner"
          },
          { quoted: msg }
        );
        return;
      }

      if (text === ".alive") {
        await sock.sendMessage(
          from,
          {
            text:
              "✅ *Lite-Ollver-MD* is active.\n" +
              "👑 Owner: RichiieeTheeGoat\n" +
              "🔣 Prefix: ."
          },
          { quoted: msg }
        );
        return;
      }

      if (text === ".owner") {
        await sock.sendMessage(
          from,
          {
            text: "👑 Owner: RichiieeTheeGoat\n📱 Number: 254740479599"
          },
          { quoted: msg }
        );
      }
    } catch (error) {
      console.error("❌ messages.upsert error:", error.message);
    }
  });
}

module.exports = startBot;
