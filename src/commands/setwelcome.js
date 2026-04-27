const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setwelcome value"
    });
  }

  await setSetting("setwelcome", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setwelcome* updated to:\n" + value
  });
}

module.exports = {
  name: "setwelcome",
  description: "setwelcome setting",
  execute
};
