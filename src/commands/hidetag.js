const { requireAdmin, getParticipantIds } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const members = getParticipantIds(base.metadata);
  await sock.sendMessage(base.jid, {
    text: args.join(" ") || "📢 Hidden tag",
    mentions: members
  });
}

module.exports = { name: "hidetag", description: "Hidden tag", execute };
