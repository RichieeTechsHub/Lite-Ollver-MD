const { readSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  const value = settings["setwelcome"] || "Not set";

  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚙️ *testwelcome*\n\n" + value
  });
}

module.exports = {
  name: "testwelcome",
  description: "testwelcome command",
  execute
};
