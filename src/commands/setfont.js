const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setfont value"
    });
  }

  await setSetting("setfont", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setfont* updated to:\n" + value
  });
}

module.exports = {
  name: "setfont",
  description: "setfont setting",
  execute
};
