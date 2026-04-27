const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setbotname value"
    });
  }

  await setSetting("setbotname", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setbotname* updated to:\n" + value
  });
}

module.exports = {
  name: "setbotname",
  description: "setbotname setting",
  execute
};
