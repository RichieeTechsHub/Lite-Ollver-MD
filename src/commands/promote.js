const { requireBotAdmin, getTarget } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const target = getTarget(msg, args);
  if (!target) return sock.sendMessage(base.jid, { text: "❌ Tag/reply to someone." });

  await sock.groupParticipantsUpdate(base.jid, [target], "promote");
  await sock.sendMessage(base.jid, { text: "✅ Member promoted." });
}

module.exports = { name: "promote", description: "Promote member", execute };
