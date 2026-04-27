const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const desc = args.join(" ");
  if (!desc) return sock.sendMessage(base.jid, { text: "❌ Usage: .setdesc new group description" });

  await sock.groupUpdateDescription(base.jid, desc);
  await sock.sendMessage(base.jid, { text: "✅ Group description updated." });
}

module.exports = { name: "setdesc", description: "Set group description", execute };
