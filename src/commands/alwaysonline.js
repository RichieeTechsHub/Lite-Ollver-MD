const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *alwaysonline*\n\nUsage: .alwaysonline on/off\nCurrent: " + (settings["alwaysonline"] ? "ON" : "OFF")
    });
  }

  await setSetting("alwaysonline", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *alwaysonline* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "alwaysonline",
  description: "alwaysonline toggle command",
  execute
};
