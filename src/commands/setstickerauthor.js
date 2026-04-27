const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setstickerauthor value"
    });
  }

  await setSetting("setstickerauthor", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setstickerauthor* updated to:\n" + value
  });
}

module.exports = {
  name: "setstickerauthor",
  description: "setstickerauthor setting",
  execute
};
