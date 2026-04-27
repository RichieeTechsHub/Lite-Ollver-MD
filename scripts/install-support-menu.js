const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
feedback: `async function execute(sock, msg, args, ctx) {
  const feedback = args.join(" ");

  if (!feedback) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .feedback your message"
    });
  }

  const owner = (ctx.OWNER_NUMBER || "254740479599") + "@s.whatsapp.net";

  await sock.sendMessage(owner, {
    text:
      "📩 *NEW FEEDBACK*\\n\\n" +
      "From: " + (msg.key.participant || msg.key.remoteJid) + "\\n\\n" +
      feedback
  });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ Feedback sent to the owner."
  });
}

module.exports = {
  name: "feedback",
  description: "Send feedback to owner",
  execute
};
`,

helpers: `async function execute(sock, msg, args, ctx) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🆘 *SUPPORT HELPERS*\\n\\n" +
      "👑 Owner: wa.me/" + (ctx.OWNER_NUMBER || "254740479599") + "\\n" +
      "📌 Use .feedback your message to report issues.\\n" +
      "🤖 Bot: " + (ctx.BOT_NAME || "Lite-Ollver-MD")
  });
}

module.exports = {
  name: "helpers",
  description: "Show support helpers",
  execute
};
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ SUPPORT MENU commands injected successfully.");
