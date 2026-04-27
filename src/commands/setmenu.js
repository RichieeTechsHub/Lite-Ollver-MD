const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setmenu value"
    });
  }

  await setSetting("setmenu", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setmenu* updated to:\n" + value
  });
}

module.exports = {
  name: "setmenu",
  description: "setmenu setting",
  execute
};
