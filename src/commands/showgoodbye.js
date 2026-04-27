const { readSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  const value = settings["setgoodbye"] || "Not set";

  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚙️ *showgoodbye*\n\n" + value
  });
}

module.exports = {
  name: "showgoodbye",
  description: "showgoodbye command",
  execute
};
