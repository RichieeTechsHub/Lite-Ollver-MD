const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  await sock.groupSettingUpdate(base.jid, "not_announcement");
  await sock.sendMessage(base.jid, { text: "✅ Group opened. Everyone can send messages." });
}

module.exports = { name: "open", description: "Open group", execute };
