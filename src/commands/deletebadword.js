const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  delete settings["deletebadword"];
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *deletebadword* cleared."
  });
}

module.exports = {
  name: "deletebadword",
  description: "deletebadword clear command",
  execute
};
