const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setprefix value"
    });
  }

  await setSetting("setprefix", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setprefix* updated to:\n" + value
  });
}

module.exports = {
  name: "setprefix",
  description: "setprefix setting",
  execute
};
