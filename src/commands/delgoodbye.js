const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  delete settings["delgoodbye"];
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *delgoodbye* cleared."
  });
}

module.exports = {
  name: "delgoodbye",
  description: "delgoodbye clear command",
  execute
};
