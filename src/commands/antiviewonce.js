const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *antiviewonce*\n\nUsage: .antiviewonce on/off\nCurrent: " + (settings["antiviewonce"] ? "ON" : "OFF")
    });
  }

  await setSetting("antiviewonce", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antiviewonce* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "antiviewonce",
  description: "antiviewonce toggle command",
  execute
};
