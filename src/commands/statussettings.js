const { readSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();

  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚙️ *BOT SETTINGS*\n\n" + JSON.stringify(settings, null, 2)
  });
}

module.exports = {
  name: "statussettings",
  description: "Show bot settings",
  execute
};
