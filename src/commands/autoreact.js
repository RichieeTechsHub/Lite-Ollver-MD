const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *autoreact*\n\nUsage: .autoreact on/off\nCurrent: " + (settings["autoreact"] ? "ON" : "OFF")
    });
  }

  await setSetting("autoreact", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autoreact* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "autoreact",
  description: "autoreact toggle command",
  execute
};
