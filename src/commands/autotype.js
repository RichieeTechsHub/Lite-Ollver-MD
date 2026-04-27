const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *autotype*\n\nUsage: .autotype on/off\nCurrent: " + (settings["autotype"] ? "ON" : "OFF")
    });
  }

  await setSetting("autotype", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autotype* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "autotype",
  description: "autotype toggle command",
  execute
};
