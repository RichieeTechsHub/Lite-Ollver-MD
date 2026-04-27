const { setSetting, readSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const option = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(option)) {
    const settings = await readSettings();
    return sock.sendMessage(msg.key.remoteJid, {
      text: "⚙️ *antideletestatus*\n\nUsage: .antideletestatus on/off\nCurrent: " + (settings["antideletestatus"] ? "ON" : "OFF")
    });
  }

  await setSetting("antideletestatus", option === "on");

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antideletestatus* turned " + option.toUpperCase()
  });
}

module.exports = {
  name: "antideletestatus",
  description: "antideletestatus toggle command",
  execute
};
