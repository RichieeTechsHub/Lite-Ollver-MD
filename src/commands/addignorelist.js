const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .addignorelist value"
    });
  }

  const settings = await readSettings();
  if (!Array.isArray(settings["addignorelist"])) settings["addignorelist"] = [];
  settings["addignorelist"].push(value);
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Added to *addignorelist*:\n" + value
  });
}

module.exports = {
  name: "addignorelist",
  description: "addignorelist add command",
  execute
};
