const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *autorecord*\n\nUsage: .autorecord on/off\nCurrent: " + (settings["autorecord"] ? "ON" : "OFF")
    });
  }

  await setSetting("autorecord", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autorecord* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "autorecord",
  description: "autorecord toggle command",
  execute
};
