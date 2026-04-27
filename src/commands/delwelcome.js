const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  delete settings["delwelcome"];
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *delwelcome* cleared."
  });
}

module.exports = {
  name: "delwelcome",
  description: "delwelcome clear command",
  execute
};
