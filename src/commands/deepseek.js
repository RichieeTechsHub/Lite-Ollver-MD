const { askGemini } = require("../lib/aiClient");

async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .deepseek your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 Thinking..."
  });

  const reply = await askGemini(input, "Think deeply and give a logical answer.");

  await sock.sendMessage(msg.key.remoteJid, {
    text: reply
  });
}

module.exports = {
  name: "deepseek",
  description: "Think deeply and give a logical answer.",
  execute
};
