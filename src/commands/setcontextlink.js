const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setcontextlink value"
    });
  }

  await setSetting("setcontextlink", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setcontextlink* updated to:\n" + value
  });
}

module.exports = {
  name: "setcontextlink",
  description: "setcontextlink setting",
  execute
};
