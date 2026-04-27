const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return sock.sendMessage(base.jid, { text: "❌ Usage: .invite 2547xxxxxxx" });

  const code = await sock.groupInviteCode(base.jid);
  await sock.sendMessage(number + "@s.whatsapp.net", {
    text: "You have been invited to join:\nhttps://chat.whatsapp.com/" + code
  });

  await sock.sendMessage(base.jid, { text: "✅ Invite sent." });
}

module.exports = { name: "invite", description: "Invite user", execute };
