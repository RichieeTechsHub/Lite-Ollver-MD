async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .gemini your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 *gemini*\n\n" + input + "\n\n✅ AI command is active. API logic will be connected next."
  });
}

module.exports = {
  name: "gemini",
  description: "Fast AI assistant",
  execute
};
