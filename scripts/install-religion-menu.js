const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
bible: `async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .bible John 3:16"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📖 *BIBLE SEARCH*\\n\\n" +
      "Verse requested: " + query + "\\n\\n" +
      "✅ Bible command is active. Verse API will be connected next."
  });
}

module.exports = {
  name: "bible",
  description: "Search Bible verse",
  execute
};
`,

quran: `async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .quran 1:1"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "☪️ *QURAN SEARCH*\\n\\n" +
      "Ayah requested: " + query + "\\n\\n" +
      "✅ Quran command is active. Quran API will be connected next."
  });
}

module.exports = {
  name: "quran",
  description: "Search Quran ayah",
  execute
};
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ RELIGION MENU commands injected successfully.");
