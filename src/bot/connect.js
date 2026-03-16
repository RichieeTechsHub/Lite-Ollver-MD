const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const P = require("pino");
const qrcode = require("qrcode-terminal");

let isStarting = false;

async function startBot() {

  if (isStarting) return;
  isStarting = true;

  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Scan this QR to link:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {

      console.log("✅ Lite-Ollver-MD connected successfully.");

      const jid = sock.user.id.split(":")[0] + "@s.whatsapp.net";

      await sock.sendMessage(jid, {
        text:
`🤖 *Lite-Ollver-MD Connected*

⚡ Status: Online
👑 Owner: Richiee the Goat
🌍 Host: Heroku Worker
📌 Prefix: .

Type *.menu* to start.`
      });

    }

    if (connection === "close") {

      const code =
        lastDisconnect?.error?.output?.statusCode ||
        lastDisconnect?.error?.statusCode;

      console.log("❌ Connection closed. Code:", code);

      if (code !== DisconnectReason.loggedOut) {
        console.log("🔄 Reconnecting...");
        startBot();
      } else {
        console.log("🚫 Session logged out. Generate new session.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (!text) return;

    const from = msg.key.remoteJid;

    if (text === ".menu") {

      await sock.sendMessage(from, {
        text:
`🐐 *Lite-Ollver-MD Menu*

1️⃣ .ping
2️⃣ .owner
3️⃣ .settings
4️⃣ .vars

Choose a command.`
      });

    }

    if (text === ".ping") {
      await sock.sendMessage(from, { text: "🏓 Pong!" });
    }

    if (text === ".owner") {
      await sock.sendMessage(from, {
        text: "👑 Owner: Richiee the Goat"
      });
    }

    if (text === ".settings") {
      await sock.sendMessage(from, {
        text:
`⚙️ *Settings*

Prefix: .
Mode: Private
Host: Heroku

More settings coming soon.`
      });
    }

    if (text === ".vars") {
      await sock.sendMessage(from, {
        text:
`📦 *Bot Variables*

BOT_NAME: Lite-Ollver-MD
OWNER: Richiee the Goat
PREFIX: .
HOST: Heroku`
      });
    }

  });
}

module.exports = { startBot };
