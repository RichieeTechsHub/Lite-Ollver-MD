const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setownernumber value"
    });
  }

  await setSetting("setownernumber", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setownernumber* updated to:\n" + value
  });
}

module.exports = {
  name: "setownernumber",
  description: "setownernumber setting",
  execute
};
