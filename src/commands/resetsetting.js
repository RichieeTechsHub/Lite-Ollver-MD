const { writeSettings } = require("../lib/botSettings");

async function execute(sock, msg) {
  await writeSettings({});

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ All bot settings reset."
  });
}

module.exports = {
  name: "resetsetting",
  description: "Reset settings",
  execute
};
