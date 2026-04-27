const { requireBotAdmin, getTarget } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const target = getTarget(msg, args);
  if (!target) return sock.sendMessage(base.jid, { text: "❌ Tag/reply to someone." });

  await sock.groupParticipantsUpdate(base.jid, [target], "demote");
  await sock.sendMessage(base.jid, { text: "✅ Member demoted." });
}

module.exports = { name: "demote", description: "Demote member", execute };
