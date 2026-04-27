const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  delete settings["delcountrycode"];
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *delcountrycode* cleared."
  });
}

module.exports = {
  name: "delcountrycode",
  description: "delcountrycode clear command",
  execute
};
