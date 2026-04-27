const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");

const simpleToggles = [
  "allow","announcements","antibadword","antibot","antidemote","antiforeign",
  "antigroupmention","antilink","antilinkgc","antisticker","antitag",
  "antitagadmin","approve","approveall","cancelkick","delallowed","delcode",
  "disapproveall","editsettings","kickinactive","listactive","listallowed",
  "listcode","listinactive","listrequests","opentime","closetime","reject",
  "welcome"
];

const toggleTemplate = (name) => `const { requireAdmin, setGroupSetting, getGroupSettings } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const value = (args[0] || "").toLowerCase();

  if (!["on", "off"].includes(value)) {
    const current = await getGroupSettings(base.jid);
    return sock.sendMessage(base.jid, {
      text: "⚙️ *${name}*\\n\\nUsage: .${name} on/off\\nCurrent: " + (current["${name}"] ? "ON" : "OFF")
    });
  }

  await setGroupSetting(base.jid, "${name}", value === "on");

  await sock.sendMessage(base.jid, {
    text: "✅ *${name}* has been turned " + value.toUpperCase()
  });
}

module.exports = { name: "${name}", description: "${name} group setting", execute };
`;

const files = {
add: `const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return sock.sendMessage(base.jid, { text: "❌ Usage: .add 2547xxxxxxx" });

  await sock.groupParticipantsUpdate(base.jid, [number + "@s.whatsapp.net"], "add");
  await sock.sendMessage(base.jid, { text: "✅ Add request sent." });
}

module.exports = { name: "add", description: "Add member", execute };
`,

kick: `const { requireBotAdmin, getTarget } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const target = getTarget(msg, args);
  if (!target) return sock.sendMessage(base.jid, { text: "❌ Tag/reply to someone or use .kick 2547xxxxxxx" });

  await sock.groupParticipantsUpdate(base.jid, [target], "remove");
  await sock.sendMessage(base.jid, { text: "✅ Member removed." });
}

module.exports = { name: "kick", description: "Remove member", execute };
`,

promote: `const { requireBotAdmin, getTarget } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const target = getTarget(msg, args);
  if (!target) return sock.sendMessage(base.jid, { text: "❌ Tag/reply to someone." });

  await sock.groupParticipantsUpdate(base.jid, [target], "promote");
  await sock.sendMessage(base.jid, { text: "✅ Member promoted." });
}

module.exports = { name: "promote", description: "Promote member", execute };
`,

demote: `const { requireBotAdmin, getTarget } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const target = getTarget(msg, args);
  if (!target) return sock.sendMessage(base.jid, { text: "❌ Tag/reply to someone." });

  await sock.groupParticipantsUpdate(base.jid, [target], "demote");
  await sock.sendMessage(base.jid, { text: "✅ Member demoted." });
}

module.exports = { name: "demote", description: "Demote member", execute };
`,

tagall: `const { requireGroup, getParticipantIds } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const jid = await requireGroup(sock, msg);
  if (!jid) return;

  const metadata = await sock.groupMetadata(jid);
  const members = getParticipantIds(metadata);
  const text = args.join(" ") || "Tag all members";

  await sock.sendMessage(jid, {
    text: "📢 *" + text + "*\\n\\n" + members.map((m, i) => (i + 1) + ". @" + m.split("@")[0]).join("\\n"),
    mentions: members
  });
}

module.exports = { name: "tagall", description: "Tag all members", execute };
`,

hidetag: `const { requireAdmin, getParticipantIds } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const members = getParticipantIds(base.metadata);
  await sock.sendMessage(base.jid, {
    text: args.join(" ") || "📢 Hidden tag",
    mentions: members
  });
}

module.exports = { name: "hidetag", description: "Hidden tag", execute };
`,

tagadmin: `const { requireGroup } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const jid = await requireGroup(sock, msg);
  if (!jid) return;

  const metadata = await sock.groupMetadata(jid);
  const admins = metadata.participants.filter(p => p.admin).map(p => p.id);

  await sock.sendMessage(jid, {
    text: "👑 *Group Admins*\\n\\n" + admins.map((a, i) => (i + 1) + ". @" + a.split("@")[0]).join("\\n"),
    mentions: admins
  });
}

module.exports = { name: "tagadmin", description: "Tag admins", execute };
`,

link: `const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const code = await sock.groupInviteCode(base.jid);
  await sock.sendMessage(base.jid, { text: "🔗 Group link:\\nhttps://chat.whatsapp.com/" + code });
}

module.exports = { name: "link", description: "Get group link", execute };
`,

resetlink: `const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  await sock.groupRevokeInvite(base.jid);
  const code = await sock.groupInviteCode(base.jid);
  await sock.sendMessage(base.jid, { text: "✅ Link reset:\\nhttps://chat.whatsapp.com/" + code });
}

module.exports = { name: "resetlink", description: "Reset group link", execute };
`,

open: `const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  await sock.groupSettingUpdate(base.jid, "not_announcement");
  await sock.sendMessage(base.jid, { text: "✅ Group opened. Everyone can send messages." });
}

module.exports = { name: "open", description: "Open group", execute };
`,

close: `const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  await sock.groupSettingUpdate(base.jid, "announcement");
  await sock.sendMessage(base.jid, { text: "✅ Group closed. Only admins can send messages." });
}

module.exports = { name: "close", description: "Close group", execute };
`,

setdesc: `const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const desc = args.join(" ");
  if (!desc) return sock.sendMessage(base.jid, { text: "❌ Usage: .setdesc new group description" });

  await sock.groupUpdateDescription(base.jid, desc);
  await sock.sendMessage(base.jid, { text: "✅ Group description updated." });
}

module.exports = { name: "setdesc", description: "Set group description", execute };
`,

setgroupname: `const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const name = args.join(" ");
  if (!name) return sock.sendMessage(base.jid, { text: "❌ Usage: .setgroupname new name" });

  await sock.groupUpdateSubject(base.jid, name);
  await sock.sendMessage(base.jid, { text: "✅ Group name updated." });
}

module.exports = { name: "setgroupname", description: "Set group name", execute };
`,

totalmembers: `const { requireGroup } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const jid = await requireGroup(sock, msg);
  if (!jid) return;

  const metadata = await sock.groupMetadata(jid);
  await sock.sendMessage(jid, { text: "👥 Total members: " + metadata.participants.length });
}

module.exports = { name: "totalmembers", description: "Total group members", execute };
`,

userid: `async function execute(sock, msg) {
  const jid = msg.key.remoteJid;
  const sender = msg.key.participant || jid;
  await sock.sendMessage(jid, { text: "🆔 Your ID:\\n" + sender });
}

module.exports = { name: "userid", description: "Show user ID", execute };
`,

invite: `const { requireBotAdmin } = require("../lib/groupUtils");

async function execute(sock, msg, args) {
  const base = await requireBotAdmin(sock, msg);
  if (!base) return;

  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return sock.sendMessage(base.jid, { text: "❌ Usage: .invite 2547xxxxxxx" });

  const code = await sock.groupInviteCode(base.jid);
  await sock.sendMessage(number + "@s.whatsapp.net", {
    text: "You have been invited to join:\\nhttps://chat.whatsapp.com/" + code
  });

  await sock.sendMessage(base.jid, { text: "✅ Invite sent." });
}

module.exports = { name: "invite", description: "Invite user", execute };
`,

poll: `async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text.includes("|")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .poll Question | Option 1 | Option 2"
    });
  }

  const parts = text.split("|").map(x => x.trim()).filter(Boolean);
  const name = parts.shift();
  const values = parts;

  await sock.sendMessage(msg.key.remoteJid, {
    poll: { name, values, selectableCount: 1 }
  });
}

module.exports = { name: "poll", description: "Create poll", execute };
`,

mediatag: `const { requireAdmin, getParticipantIds } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const base = await requireAdmin(sock, msg);
  if (!base) return;

  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quoted) return sock.sendMessage(base.jid, { text: "❌ Reply to media with .mediatag" });

  const members = getParticipantIds(base.metadata);
  await sock.sendMessage(base.jid, { text: "📢 Media tag", mentions: members });
}

module.exports = { name: "mediatag", description: "Media tag", execute };
`,

vcf: `const { requireGroup } = require("../lib/groupUtils");

async function execute(sock, msg) {
  const jid = await requireGroup(sock, msg);
  if (!jid) return;

  const metadata = await sock.groupMetadata(jid);
  const contacts = metadata.participants.map(p => {
    const n = p.id.split("@")[0];
    return "BEGIN:VCARD\\nVERSION:3.0\\nFN:+" + n + "\\nTEL;type=CELL;type=VOICE;waid=" + n + ":+" + n + "\\nEND:VCARD";
  }).join("\\n");

  await sock.sendMessage(jid, {
    document: Buffer.from(contacts),
    fileName: "group-contacts.vcf",
    mimetype: "text/vcard"
  });
}

module.exports = { name: "vcf", description: "Export group contacts", execute };
`
};

for (const name of simpleToggles) {
  files[name] = toggleTemplate(name);
}

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ Real GROUP MENU commands injected.");
