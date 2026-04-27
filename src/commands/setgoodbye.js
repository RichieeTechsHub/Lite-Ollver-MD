const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setgoodbye value"
    });
  }

  await setSetting("setgoodbye", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setgoodbye* updated to:\n" + value
  });
}

module.exports = {
  name: "setgoodbye",
  description: "setgoodbye setting",
  execute
};
