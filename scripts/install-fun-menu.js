const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const funCommands = {
  fact: {
    desc: "Random fact",
    reply: "🧠 *Random Fact*\\n\\nHoney never spoils. Archaeologists have found edible honey in ancient Egyptian tombs."
  },
  jokes: {
    desc: "Random joke",
    reply: "😂 *Joke*\\n\\nWhy did the developer go broke? Because he used up all his cache."
  },
  memes: {
    desc: "Meme command",
    reply: "🤣 *Meme Mode*\\n\\nMemes command is active. Image meme API will be connected later."
  },
  quotes: {
    desc: "Motivational quote",
    reply: "💬 *Quote*\\n\\nSuccess is not final, failure is not fatal: it is the courage to continue that counts."
  },
  trivia: {
    desc: "Trivia question",
    reply: "🎯 *Trivia*\\n\\nQuestion: What planet is known as the Red Planet?\\n\\nAnswer: Mars."
  },
  truthdetector: {
    desc: "Truth detector",
    reply: "🕵️ *Truth Detector*\\n\\nAnalyzing... 73% truth detected 😂"
  },
  xxqc: {
    desc: "Fun reaction",
    reply: "⚡ *XXQC Mode*\\n\\nCommand active. Reaction engine will be upgraded later."
  }
};

for (const [name, data] of Object.entries(funCommands)) {
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

console.log("✅ FUN MENU commands injected successfully.");
