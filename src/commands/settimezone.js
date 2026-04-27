const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .settimezone value"
    });
  }

  await setSetting("settimezone", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *settimezone* updated to:\n" + value
  });
}

module.exports = {
  name: "settimezone",
  description: "settimezone setting",
  execute
};
