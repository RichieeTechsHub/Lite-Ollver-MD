const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const name = args.join(" ");
  if (!name) return sock.sendMessage(base.jid, { text: "❌ Usage: .setgroupname new name" });

  await sock.groupUpdateSubject(base.jid, name);
  await sock.sendMessage(base.jid, { text: "✅ Group name updated." });
}

module.exports = { name: "setgroupname", description: "Set group name", execute };
