const { requireGroup, getParticipantIds } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const jid = await requireGroup(sock, msg);
  if (!jid) return;

  const metadata = await sock.groupMetadata(jid);
  const members = getParticipantIds(metadata);
  const text = args.join(" ") || "Tag all members";

  await sock.sendMessage(jid, {
    text: "📢 *" + text + "*\n\n" + members.map((m, i) => (i + 1) + ". @" + m.split("@")[0]).join("\n"),
    mentions: members
  });
}

module.exports = { name: "tagall", description: "Tag all members", execute };
