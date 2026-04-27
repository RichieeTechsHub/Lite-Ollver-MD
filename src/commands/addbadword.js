const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .addbadword value"
    });
  }

  const settings = await readSettings();
  if (!Array.isArray(settings["addbadword"])) settings["addbadword"] = [];
  settings["addbadword"].push(value);
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Added to *addbadword*:\n" + value
  });
}

module.exports = {
  name: "addbadword",
  description: "addbadword add command",
  execute
};
