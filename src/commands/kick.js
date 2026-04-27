const { requireBotAdmin, getTarget } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const target = getTarget(msg, args);
  if (!target) return sock.sendMessage(base.jid, { text: "❌ Tag/reply to someone or use .kick 2547xxxxxxx" });

  await sock.groupParticipantsUpdate(base.jid, [target], "remove");
  await sock.sendMessage(base.jid, { text: "✅ Member removed." });
}

module.exports = { name: "kick", description: "Remove member", execute };
