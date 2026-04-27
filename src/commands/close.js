const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  await sock.groupSettingUpdate(base.jid, "announcement");
  await sock.sendMessage(base.jid, { text: "✅ Group closed. Only admins can send messages." });
}

module.exports = { name: "close", description: "Close group", execute };
