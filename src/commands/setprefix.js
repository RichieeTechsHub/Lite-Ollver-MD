const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const prefix = args[0];

  if (!prefix) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setprefix !"
    });
  }

  if (prefix.length > 3) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Prefix too long. Use 1-3 characters."
    });
  }

  await setSetting("prefix", prefix);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Prefix changed to: " + prefix + "\n\nNow use: " + prefix + "menu"
  });
}

module.exports = {
  name: "setprefix",
  description: "Change bot prefix",
  execute
};
