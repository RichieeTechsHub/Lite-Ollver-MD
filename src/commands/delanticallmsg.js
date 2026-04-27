const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  const settings = await readSettings();
  delete settings["delanticallmsg"];
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *delanticallmsg* cleared."
  });
}

module.exports = {
  name: "delanticallmsg",
  description: "delanticallmsg clear command",
  execute
};
