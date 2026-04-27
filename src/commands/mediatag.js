const { requireAdmin, getParticipantIds } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quoted) return sock.sendMessage(base.jid, { text: "❌ Reply to media with .mediatag" });

  const members = getParticipantIds(base.metadata);
  await sock.sendMessage(base.jid, { text: "📢 Media tag", mentions: members });
}

module.exports = { name: "mediatag", description: "Media tag", execute };
