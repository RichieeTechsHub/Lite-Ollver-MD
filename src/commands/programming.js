const { askGemini } = require("../lib/aiClient");

async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .programming your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 Thinking..."
  });

  const reply = await askGemini(input, "Help solve this programming task step by step.");

  await sock.sendMessage(msg.key.remoteJid, {
    text: reply
  });
}

module.exports = {
  name: "programming",
  description: "Help solve this programming task step by step.",
  execute
};
