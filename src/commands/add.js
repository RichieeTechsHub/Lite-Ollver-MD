const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return sock.sendMessage(base.jid, { text: "❌ Usage: .add 2547xxxxxxx" });

  await sock.groupParticipantsUpdate(base.jid, [number + "@s.whatsapp.net"], "add");
  await sock.sendMessage(base.jid, { text: "✅ Add request sent." });
}

module.exports = { name: "add", description: "Add member", execute };
