async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .code your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 *code*\n\n" + input + "\n\n✅ AI command is active. API logic will be connected next."
  });
}

module.exports = {
  name: "code",
  description: "Generate code",
  execute
};
