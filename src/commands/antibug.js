const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *antibug*\n\nUsage: .antibug on/off\nCurrent: " + (settings["antibug"] ? "ON" : "OFF")
    });
  }

  await setSetting("antibug", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antibug* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "antibug",
  description: "antibug toggle command",
  execute
};
