const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setanticallmsg value"
    });
  }

  await setSetting("setanticallmsg", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setanticallmsg* updated to:\n" + value
  });
}

module.exports = {
  name: "setanticallmsg",
  description: "setanticallmsg setting",
  execute
};
