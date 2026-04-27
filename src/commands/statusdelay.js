const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *statusdelay*\n\nUsage: .statusdelay on/off\nCurrent: " + (settings["statusdelay"] ? "ON" : "OFF")
    });
  }

  await setSetting("statusdelay", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *statusdelay* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "statusdelay",
  description: "statusdelay toggle command",
  execute
};
