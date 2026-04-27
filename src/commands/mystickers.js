const fs = require("fs-extra");
const path = require("path");

const SAVE_DIR = path.join(__dirname, "..", "..", "data", "stickers");

async function execute(sock, msg) {
  await fs.ensureDir(SAVE_DIR);

  const files = (await fs.readdir(SAVE_DIR)).filter(f => f.endsWith(".webp"));

  if (!files.length) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "📦 No stickers saved yet.\n\nReply to a sticker with .take"
    });
  }

  const list = files
    .map((file, i) => `${i + 1}. ${file}`)
    .join("\n");

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📦 *Lite-Ollver-MD Sticker Pack*\n\n" +
      list +
      "\n\nUse:\n.sendsticker 1\n.delsticker 1"
  });
}

module.exports = {
  name: "mystickers",
  description: "List saved sticker pack",
  execute
};
