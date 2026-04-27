const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *autorecordtyping*\n\nUsage: .autorecordtyping on/off\nCurrent: " + (settings["autorecordtyping"] ? "ON" : "OFF")
    });
  }

  await setSetting("autorecordtyping", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autorecordtyping* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "autorecordtyping",
  description: "autorecordtyping toggle command",
  execute
};
