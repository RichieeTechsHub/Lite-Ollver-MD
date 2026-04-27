const { requireGroup } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const jid = await requireGroup(sock, msg);
  if (!jid) return;

  const metadata = await sock.groupMetadata(jid);
  const admins = metadata.participants.filter(p => p.admin).map(p => p.id);

  await sock.sendMessage(jid, {
    text: "👑 *Group Admins*\n\n" + admins.map((a, i) => (i + 1) + ". @" + a.split("@")[0]).join("\n"),
    mentions: admins
  });
}

module.exports = { name: "tagadmin", description: "Tag admins", execute };
