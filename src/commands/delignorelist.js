const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  delete settings["delignorelist"];
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *delignorelist* cleared."
  });
}

module.exports = {
  name: "delignorelist",
  description: "delignorelist clear command",
  execute
};
