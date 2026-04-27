async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .dalle your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 *dalle*\n\n" + input + "\n\n✅ AI command is active. API logic will be connected next."
  });
}

module.exports = {
  name: "dalle",
  description: "Image prompt generator",
  execute
};
