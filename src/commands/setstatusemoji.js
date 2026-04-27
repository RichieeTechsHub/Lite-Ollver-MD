const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setstatusemoji value"
    });
  }

  await setSetting("setstatusemoji", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setstatusemoji* updated to:\n" + value
  });
}

module.exports = {
  name: "setstatusemoji",
  description: "setstatusemoji setting",
  execute
};
