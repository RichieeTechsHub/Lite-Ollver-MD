async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .translate2 your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 *translate2*\n\n" + input + "\n\n✅ AI command is active. API logic will be connected next."
  });
}

module.exports = {
  name: "translate2",
  description: "Translator",
  execute
};
