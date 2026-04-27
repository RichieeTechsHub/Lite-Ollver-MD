async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .story your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 *story*\n\n" + input + "\n\n✅ AI command is active. API logic will be connected next."
  });
}

module.exports = {
  name: "story",
  description: "Story writer",
  execute
};
