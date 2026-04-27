const { setSetting } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .setmenuimage value"
    });
  }

  await setSetting("setmenuimage", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setmenuimage* updated to:\n" + value
  });
}

module.exports = {
  name: "setmenuimage",
  description: "setmenuimage setting",
  execute
};
