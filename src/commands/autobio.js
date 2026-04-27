const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *autobio*\n\nUsage: .autobio on/off\nCurrent: " + (settings["autobio"] ? "ON" : "OFF")
    });
  }

  await setSetting("autobio", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autobio* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "autobio",
  description: "autobio toggle command",
  execute
};
