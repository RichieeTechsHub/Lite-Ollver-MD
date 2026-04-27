const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *anticall*\n\nUsage: .anticall on/off\nCurrent: " + (settings["anticall"] ? "ON" : "OFF")
    });
  }

  await setSetting("anticall", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *anticall* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "anticall",
  description: "anticall toggle command",
  execute
};
