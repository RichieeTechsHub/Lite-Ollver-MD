const path = require("path");
const fs = require("fs-extra");
const Pino = require("pino");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

function cleanNumber(value = "") {
  return String(value).replace(/\D/g, "");
}

function formatPairCode(code = "") {
  return code.match(/.{1,4}/g)?.join("-") || code;
}

async function execute(sock, msg, args) {
  const number = cleanNumber(args[0] || "");

  if (!number || number.length < 10) {
    return sock.sendMessage(msg.key.remoteJid, {
      text:
        "❌ Usage:\n\n" +
        ".reqpair 254740479599\n\n" +
        "Use country code format without +."
    });
  }

  const tempDir = path.join(__dirname, "..", "temp_pair", number + "_" + Date.now());

  try {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "🔐 Generating pairing code for +" + number + "..."
    });

    await fs.ensureDir(tempDir);

    const { state, saveCreds } = await useMultiFileAuthState(tempDir);
    const { version } = await fetchLatestBaileysVersion();

    const pairSock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      logger: Pino({ level: "silent" }),
      browser: ["Lite-Ollver-MD", "Chrome", "1.0.0"],
      markOnlineOnConnect: false,
    });

    pairSock.ev.on("creds.update", saveCreds);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const code = await pairSock.requestPairingCode(number);
    const formatted = formatPairCode(code);

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        "✅ *PAIRING CODE GENERATED*\n\n" +
        "📱 Number: +" + number + "\n" +
        "🔐 Code: *" + formatted + "*\n\n" +
        "Open WhatsApp > Linked Devices > Link with phone number."
    });

    try {
      pairSock.ws.close();
    } catch {}

    await fs.remove(tempDir).catch(() => {});
  } catch (err) {
    await fs.remove(tempDir).catch(() => {});

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        "❌ Failed to generate pairing code.\n\n" +
        "Reason: " + err.message
    });
  }
}

module.exports = {
  name: "reqpair",
  description: "Generate WhatsApp pairing code",
  execute,
};
