const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const code = await sock.groupInviteCode(base.jid);
  await sock.sendMessage(base.jid, { text: "🔗 Group link:\nhttps://chat.whatsapp.com/" + code });
}

module.exports = { name: "link", description: "Get group link", execute };
