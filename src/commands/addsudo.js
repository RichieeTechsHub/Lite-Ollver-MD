const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .addsudo value"
    });
  }

  const settings = await readSettings();
  if (!Array.isArray(settings["addsudo"])) settings["addsudo"] = [];
  settings["addsudo"].push(value);
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Added to *addsudo*:\n" + value
  });
}

module.exports = {
  name: "addsudo",
  description: "addsudo add command",
  execute
};
