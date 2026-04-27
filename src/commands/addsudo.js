const { addSudo, cleanNumber } = require("../lib/adminAccess");

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
      text: "❌ Usage: .addsudo 2547xxxxxxx"
    });
  }

  await addSudo(number);

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Sudo user added:\n+" + number
  });
}

module.exports = {
  name: "addsudo",
  description: "Add sudo user",
  execute
};
