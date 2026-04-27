const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setwatermark value"
    });
  }

  await setSetting("setwatermark", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setwatermark* updated to:\n" + value
  });
}

module.exports = {
  name: "setwatermark",
  description: "setwatermark setting",
  execute
};
