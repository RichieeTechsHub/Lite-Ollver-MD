const { readSettings, writeSettings } = require("../lib/botSettings");

async function execute(sock, msg, args) {
  const value = args.join(" ");

  if (!value) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .addcountrycode value"
    });
  }

  const settings = await readSettings();
  if (!Array.isArray(settings["addcountrycode"])) settings["addcountrycode"] = [];
  settings["addcountrycode"].push(value);
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Added to *addcountrycode*:\n" + value
  });
}

module.exports = {
  name: "addcountrycode",
  description: "addcountrycode add command",
  execute
};
