const { askGemini } = require("../lib/aiClient");

async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .recipe your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 Thinking..."
  });

  const reply = await askGemini(input, "Create a good recipe.");

  await sock.sendMessage(msg.key.remoteJid, {
    text: reply
  });
}

module.exports = {
  name: "recipe",
  description: "Create a good recipe.",
  execute
};
