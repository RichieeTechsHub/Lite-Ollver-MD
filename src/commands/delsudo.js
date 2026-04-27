const { removeSudo, cleanNumber } = require("../lib/adminAccess");

async function execute(sock, msg, args, ctx) {
  const sender = cleanNumber(msg.key.participant || msg.key.remoteJid);
  const owner = cleanNumber(ctx.OWNER_NUMBER);

  if (sender !== owner) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Owner only command."
    });
  }

  const number = cleanNumber(args[0] || "");

  if (!number) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .delsudo 2547xxxxxxx"
    });
  }

  await removeSudo(number);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Sudo user removed:\n+" + number
  });
}

module.exports = {
  name: "delsudo",
  description: "Remove sudo user",
  execute
};
