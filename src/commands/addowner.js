const { readSettings, writeSettings } = require("../lib/botSettings");

function cleanNumber(num = "") {
  return String(num).replace(/\D/g, "");
}

async function execute(sock, msg, args, ctx) {
  const sender = (msg.key.participant || msg.key.remoteJid || "").split("@")[0];

  const number = cleanNumber(args[0] || "");

  if (!number) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .addowner 2547xxxxxxxx",
    });
  }

  // 🔥 allow initial owner OR existing owner
  const settings = await readSettings();
  const currentOwner = settings.ownerNumber || ctx.OWNER_NUMBER;

  if (sender !== currentOwner && sender !== ctx.OWNER_NUMBER) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Only owner can set owner.",
    });
  }

  settings.ownerNumber = number;
  await writeSettings(settings);

  await sock.sendMessage(msg.key.remoteJid, {
    text: `✅ Owner updated to +${number}`,
  });
}

module.exports = {
  name: "addowner",
  description: "Set new owner number",
  execute,
};
