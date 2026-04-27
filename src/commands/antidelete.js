const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *antidelete*\n\nUsage: .antidelete on/off\nCurrent: " + (settings["antidelete"] ? "ON" : "OFF")
    });
  }

  await setSetting("antidelete", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antidelete* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "antidelete",
  description: "antidelete toggle command",
  execute
};
