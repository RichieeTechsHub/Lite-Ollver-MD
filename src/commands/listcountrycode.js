const { readSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  const value = settings["setcountrycode"] || "Not set";

  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚙️ *listcountrycode*\n\n" + value
  });
}

module.exports = {
  name: "listcountrycode",
  description: "listcountrycode command",
  execute
};
