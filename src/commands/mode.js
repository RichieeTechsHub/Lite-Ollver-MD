const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = (args[0] || "").toLowerCase();

  if (!["public", "private"].includes(value)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "🔐 *MODE SETTINGS*\n\nCurrent: " + (settings.mode || "public") + "\n\nUsage:\n.mode public\n.mode private"
    });
  }

  await setSetting("mode", value);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Bot mode changed to *" + value + "*"
  });
}

module.exports = {
  name: "mode",
  description: "Set bot mode",
  execute
};
