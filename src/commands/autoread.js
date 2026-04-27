const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *autoread*\n\nUsage: .autoread on/off\nCurrent: " + (settings["autoread"] ? "ON" : "OFF")
    });
  }

  await setSetting("autoread", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autoread* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "autoread",
  description: "autoread toggle command",
  execute
};
