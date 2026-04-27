const fs = require("fs-extra");
const path = require("path");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

const SAVE_DIR = path.join(__dirname, "..", "..", "data", "stickers");

async function execute(sock, msg, args) {
  try {
    const quotedInfo = msg.message?.extendedTextMessage?.contextInfo;
    const quoted = quotedInfo?.quotedMessage;

    if (!quoted?.stickerMessage) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Reply to a sticker with .take"
      });
    }

    await fs.ensureDir(SAVE_DIR);

    const quotedMsg = {
      key: {
        remoteJid: msg.key.remoteJid,
        id: quotedInfo.stanzaId,
        participant: quotedInfo.participant
      },
      message: quoted
    };

    const buffer = await downloadMediaMessage(
      quotedMsg,
      "buffer",
      {},
      { logger: console, reuploadRequest: sock.updateMediaMessage }
    );

    const name = args.join("_").replace(/[^a-zA-Z0-9_-]/g, "") || "sticker";
    const fileName = `${Date.now()}_${name}.webp`;
    const filePath = path.join(SAVE_DIR, fileName);

    await fs.writeFile(filePath, buffer);

    const files = (await fs.readdir(SAVE_DIR)).filter(f => f.endsWith(".webp"));

    await sock.sendMessage(msg.key.remoteJid, {
      text:
        "✅ Sticker saved to favorites.\n\n" +
        "📦 Pack: Lite-Ollver-MD Stickers\n" +
        "🧩 Total stickers: " + files.length + "\n\n" +
        "Use .mystickers to view saved stickers."
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to save sticker: " + err.message
    });
  }
}

module.exports = {
  name: "take",
  description: "Save sticker to favorites pack",
  execute
};
