const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setwarn value"
    });
  }

  await setSetting("setwarn", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setwarn* updated to:\n" + value
  });
}

module.exports = {
  name: "setwarn",
  description: "setwarn setting",
  execute
};
