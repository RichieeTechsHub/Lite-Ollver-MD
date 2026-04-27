const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *autoreactstatus*\n\nUsage: .autoreactstatus on/off\nCurrent: " + (settings["autoreactstatus"] ? "ON" : "OFF")
    });
  }

  await setSetting("autoreactstatus", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autoreactstatus* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "autoreactstatus",
  description: "autoreactstatus toggle command",
  execute
};
