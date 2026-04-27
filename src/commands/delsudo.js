const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  delete settings["delsudo"];
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *delsudo* cleared."
  });
}

module.exports = {
  name: "delsudo",
  description: "delsudo clear command",
  execute
};
