const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *mode*\n\nUsage: .mode on/off\nCurrent: " + (settings["mode"] ? "ON" : "OFF")
    });
  }

  await setSetting("mode", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *mode* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "mode",
  description: "mode toggle command",
  execute
};
