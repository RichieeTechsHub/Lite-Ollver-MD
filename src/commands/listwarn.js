const { readSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  const value = settings["setwarn"] || "Not set";

  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚙️ *listwarn*\n\n" + value
  });
}

module.exports = {
  name: "listwarn",
  description: "listwarn command",
  execute
};
