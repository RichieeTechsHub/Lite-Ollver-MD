async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .gpt your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 *gpt*\n\n" + input + "\n\n✅ AI command is active. API logic will be connected next."
  });
}

module.exports = {
  name: "gpt",
  description: "GPT assistant",
  execute
};
