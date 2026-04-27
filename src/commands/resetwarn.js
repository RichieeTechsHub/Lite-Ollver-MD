const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *resetwarn*\n\nUsage: .resetwarn on/off\nCurrent: " + (settings["resetwarn"] ? "ON" : "OFF")
    });
  }

  await setSetting("resetwarn", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *resetwarn* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "resetwarn",
  description: "resetwarn toggle command",
  execute
};
