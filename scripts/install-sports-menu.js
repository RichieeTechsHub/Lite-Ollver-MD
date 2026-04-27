const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const files = {
eplmatches: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚽ *EPL MATCHES*\\n\\n✅ Command active. Live football API will be connected next."
  });
}

module.exports = { name: "eplmatches", description: "EPL matches", execute };
`,

eplstandings: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏆 *EPL STANDINGS*\\n\\n✅ Command active. Standings API will be connected next."
  });
}

module.exports = { name: "eplstandings", description: "EPL standings", execute };
`,

clmatches: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏟️ *CHAMPIONS LEAGUE MATCHES*\\n\\n✅ Command active. UCL API will be connected next."
  });
}

module.exports = { name: "clmatches", description: "Champions League matches", execute };
`,

wwenews: `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤼 *WWE NEWS*\\n\\n✅ Command active. Sports news API will be connected next."
  });
}

module.exports = { name: "wwenews", description: "WWE news", execute };
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ SPORTS MENU commands injected successfully.");
