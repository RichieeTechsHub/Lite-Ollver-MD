const { requireGroup } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const jid = await requireGroup(sock, msg);
  if (!jid) return;

  const metadata = await sock.groupMetadata(jid);
  await sock.sendMessage(jid, { text: "👥 Total members: " + metadata.participants.length });
}

module.exports = { name: "totalmembers", description: "Total group members", execute };
