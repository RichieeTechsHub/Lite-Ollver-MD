async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .analyze your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 *analyze*\n\n" + input + "\n\n✅ AI command is active. API logic will be connected next."
  });
}

module.exports = {
  name: "analyze",
  description: "Analyze text clearly",
  execute
};
