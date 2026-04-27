const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setstickerpackname value"
    });
  }

  await setSetting("setstickerpackname", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setstickerpackname* updated to:\n" + value
  });
}

module.exports = {
  name: "setstickerpackname",
  description: "setstickerpackname setting",
  execute
};
