const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const gameCommands = {
  dare: {
    desc: "Get a random dare",
    reply: "🔥 *DARE*\\n\\nSend a voice note confessing your crush 😭"
  },
  truth: {
    desc: "Get a random truth",
    reply: "🤫 *TRUTH*\\n\\nWhat is something you've never told anyone?"
  },
  truthordare: {
    desc: "Play truth or dare",
    reply: "🎲 *TRUTH OR DARE*\\n\\nType:\\n.truth OR .dare"
  }
};

for (const [name, data] of Object.entries(gameCommands)) {
  const content = `async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "${data.reply}"
  });
}

module.exports = {
  name: "${name}",
  description: "${data.desc}",
  execute
};
`;

  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ GAMES MENU commands injected successfully.");
