const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *autoblock*\n\nUsage: .autoblock on/off\nCurrent: " + (settings["autoblock"] ? "ON" : "OFF")
    });
  }

  await setSetting("autoblock", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autoblock* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "autoblock",
  description: "autoblock toggle command",
  execute
};
