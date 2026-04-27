const { requireGroup } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const jid = await requireGroup(sock, msg);
  if (!jid) return;

  const metadata = await sock.groupMetadata(jid);
  const contacts = metadata.participants.map(p => {
    const n = p.id.split("@")[0];
    return "BEGIN:VCARD\nVERSION:3.0\nFN:+" + n + "\nTEL;type=CELL;type=VOICE;waid=" + n + ":+" + n + "\nEND:VCARD";
  }).join("\n");

  await sock.sendMessage(jid, {
    document: Buffer.from(contacts),
    fileName: "group-contacts.vcf",
    mimetype: "text/vcard"
  });
}

module.exports = { name: "vcf", description: "Export group contacts", execute };
