const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setownername value"
    });
  }

  await setSetting("setownername", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setownername* updated to:\n" + value
  });
}

module.exports = {
  name: "setownername",
  description: "setownername setting",
  execute
};
