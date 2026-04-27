const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
fetchgroups: `async function execute(sock, msg) {
  try {
    const groups = await sock.groupFetchAllParticipating();
    const list = Object.values(groups);

    if (!list.length) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Bot is not in any groups."
      });
    }

    const text = list.map((g, i) =>
      (i + 1) + ". " + g.subject + "\\nID: " + g.id + "\\nMembers: " + (g.participants?.length || 0)
    ).join("\\n\\n");

    await sock.sendMessage(msg.key.remoteJid, {
      text: "👥 *GROUPS FETCHED*\\n\\n" + text
    });
  } catch (err) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Failed to fetch groups."
    });
  }
}

module.exports = {
  name: "fetchgroups",
  description: "Fetch all groups where bot is present",
  execute
};
`,

tosgroup: `async function execute(sock, msg, args) {
  const jid = msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return sock.sendMessage(jid, {
      text: "❌ This command only works inside a group."
    });
  }

  const text = args.join(" ");

  if (!text) {
    return sock.sendMessage(jid, {
      text: "❌ Usage: .tosgroup your message here"
    });
  }

  await sock.sendMessage(jid, {
    text: "📢 *GROUP STATUS MESSAGE*\\n\\n" + text
  });
}

module.exports = {
  name: "tosgroup",
  description: "Send text as group status-style message",
  execute
};
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ GROUPSTATUS MENU commands injected successfully.");
