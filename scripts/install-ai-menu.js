const fs = require("fs");
const path = require("path");

const commandsDir = path.join(__dirname, "..", "src", "commands");
fs.mkdirSync(commandsDir, { recursive: true });

const aiCommands = {
  analyze: "Analyze text clearly",
  blackbox: "Coding assistant",
  code: "Generate code",
  dalle: "Image prompt generator",
  deepseek: "Deep reasoning assistant",
  doppleai: "Roleplay AI",
  gemini: "Fast AI assistant",
  generate: "Generate content",
  gpt: "GPT assistant",
  programming: "Programming helper",
  recipe: "Recipe maker",
  story: "Story writer",
  summarize: "Summarizer",
  teach: "Teacher",
  translate2: "Translator"
};

for (const [name, description] of Object.entries(aiCommands)) {
  const content = `async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .${name} your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 *${name}*\\n\\n" + input + "\\n\\n✅ AI command is active. API logic will be connected next."
  });
}

module.exports = {
  name: "${name}",
  description: "${description}",
  execute
};
`;

  fs.writeFileSync(path.join(commandsDir, `${name}.js`), content);
}

console.log("✅ AI MENU commands installed successfully.");
