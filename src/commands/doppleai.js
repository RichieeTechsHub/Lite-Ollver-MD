const { askGemini } = require("../lib/aiClient");

async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .doppleai your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 Thinking..."
  });

  const reply = await askGemini(input, "Roleplay naturally as requested.");

  await sock.sendMessage(msg.key.remoteJid, {
    text: reply
  });
}

module.exports = {
  name: "doppleai",
  description: "Roleplay naturally as requested.",
  execute
};
