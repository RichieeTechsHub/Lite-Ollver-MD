const fs = require("fs-extra");
const path = require("path");

const SAVE_DIR = path.join(__dirname, "..", "..", "data", "stickers");

async function execute(sock, msg, args) {
  await fs.ensureDir(SAVE_DIR);

  const index = parseInt(args[0], 10);

  if (!index) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .delsticker 1"
    });
  }

  const files = (await fs.readdir(SAVE_DIR)).filter(f => f.endsWith(".webp"));
  const file = files[index - 1];

  if (!file) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Sticker not found. Use .mystickers"
    });
  }

  await fs.remove(path.join(SAVE_DIR, file));

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Sticker deleted from favorites."
  });
}

module.exports = {
  name: "delsticker",
  description: "Delete saved sticker",
  execute
};
