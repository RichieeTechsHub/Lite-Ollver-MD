const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(dir, { recursive: true });

const commands = {
  gpt: "Answer clearly and intelligently.",
  gemini: "Answer using Gemini AI.",
  deepseek: "Think deeply and give a logical answer.",
  blackbox: "Act as a coding assistant.",
  code: "Write clean working code.",
  programming: "Help solve this programming task step by step.",
  analyze: "Analyze this carefully and give useful points.",
  generate: "Generate high-quality content.",
  summarize: "Summarize this clearly.",
  teach: "Teach this topic simply with examples.",
  recipe: "Create a good recipe.",
  story: "Write a creative story.",
  dalle: "Create a detailed image-generation prompt.",
  doppleai: "Roleplay naturally as requested.",
  translate2: "Translate the text and mention the language."
};

for (const [name, system] of Object.entries(commands)) {
  const content = `const { askGemini } = require("../lib/aiClient");

async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .${name} your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 Thinking..."
  });

  const reply = await askGemini(input, "${system}");

  await sock.sendMessage(msg.key.remoteJid, {
    text: reply
  });
}

module.exports = {
  name: "${name}",
  description: "${system}",
  execute
};
`;

  fs.writeFileSync(path.join(dir, name + ".js"), content);
}

console.log("✅ Real AI commands created successfully.");
