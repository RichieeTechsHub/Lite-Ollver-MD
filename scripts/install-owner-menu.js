const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
owner: `async function execute(sock, msg, args, ctx) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "👑 *OWNER INFO*\\n\\n" +
      "Owner: RichieeTheeGoat\\n" +
      "Number: wa.me/" + (ctx.OWNER_NUMBER || "254740479599")
  });
}

module.exports = { name: "owner", description: "Owner info", execute };
`,

block: `async function execute(sock, msg, args) {
  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .block 2547xxxxxxx" });

  await sock.updateBlockStatus(number + "@s.whatsapp.net", "block");
  await sock.sendMessage(msg.key.remoteJid, { text: "✅ User blocked." });
}

module.exports = { name: "block", description: "Block user", execute };
`,

unblock: `async function execute(sock, msg, args) {
  const number = args[0]?.replace(/[^0-9]/g, "");
  if (!number) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .unblock 2547xxxxxxx" });

  await sock.updateBlockStatus(number + "@s.whatsapp.net", "unblock");
  await sock.sendMessage(msg.key.remoteJid, { text: "✅ User unblocked." });
}

module.exports = { name: "unblock", description: "Unblock user", execute };
`,

join: `async function execute(sock, msg, args) {
  const link = args[0];
  if (!link || !link.includes("chat.whatsapp.com/")) {
    return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .join https://chat.whatsapp.com/JKF3XHbmKY47IQZc7d3LB2?mode=gi_t" });
  }

  const code = link.split("chat.whatsapp.com/")[1].trim();
  await sock.groupAcceptInvite(code);
  await sock.sendMessage(msg.key.remoteJid, { text: "✅ Joined group successfully." });
}

module.exports = { name: "join", description: "Join group by invite", execute };
`,

leave: `async function execute(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return sock.sendMessage(jid, { text: "❌ This command works in groups only." });
  }

  await sock.sendMessage(jid, { text: "👋 Leaving group..." });
  await sock.groupLeave(jid);
}

module.exports = { name: "leave", description: "Leave group", execute };
`,

restart: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, { text: "♻️ Restarting bot..." });
  setTimeout(() => process.exit(1), 1000);
}

module.exports = { name: "restart", description: "Restart bot", execute };
`,

update: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "⬆️ *UPDATE INFO*\\n\\n" +
      "Push latest files to GitHub, then restart Heroku worker."
  });
}

module.exports = { name: "update", description: "Update info", execute };
`,

setbio: `async function execute(sock, msg, args) {
  const bio = args.join(" ");
  if (!bio) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .setbio new bio" });

  await sock.updateProfileStatus(bio);
  await sock.sendMessage(msg.key.remoteJid, { text: "✅ Bio updated." });
}

module.exports = { name: "setbio", description: "Set bot bio", execute };
`,

setprofilepic: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🖼️ Reply to an image with .setprofilepic. Image upload logic will be finalized after media tools."
  });
}

module.exports = { name: "setprofilepic", description: "Set profile picture", execute };
`,

react: `async function execute(sock, msg, args) {
  const emoji = args[0] || "✅";

  await sock.sendMessage(msg.key.remoteJid, {
    react: {
      text: emoji,
      key: msg.key
    }
  });
}

module.exports = { name: "react", description: "React to command message", execute };
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ OWNER MENU commands injected successfully.");
