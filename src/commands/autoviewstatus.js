const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *autoviewstatus*\n\nUsage: .autoviewstatus on/off\nCurrent: " + (settings["autoviewstatus"] ? "ON" : "OFF")
    });
  }

  await setSetting("autoviewstatus", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autoviewstatus* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "autoviewstatus",
  description: "autoviewstatus toggle command",
  execute
};
