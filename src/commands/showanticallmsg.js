const { readSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  const value = settings["setanticallmsg"] || "Not set";

  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚙️ *showanticallmsg*\n\n" + value
  });
}

module.exports = {
  name: "showanticallmsg",
  description: "showanticallmsg command",
  execute
};
