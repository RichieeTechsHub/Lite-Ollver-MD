const { askGemini } = require("../lib/aiClient");

async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .blackbox your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 Thinking..."
  });

  const reply = await askGemini(input, "Act as a coding assistant.");

  await sock.sendMessage(msg.key.remoteJid, {
    text: reply
  });
}

module.exports = {
  name: "blackbox",
  description: "Act as a coding assistant.",
  execute
};
