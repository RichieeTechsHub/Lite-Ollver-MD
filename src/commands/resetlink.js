const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  await sock.groupRevokeInvite(base.jid);
  const code = await sock.groupInviteCode(base.jid);
  await sock.sendMessage(base.jid, { text: "✅ Link reset:\nhttps://chat.whatsapp.com/" + code });
}

module.exports = { name: "resetlink", description: "Reset group link", execute };
