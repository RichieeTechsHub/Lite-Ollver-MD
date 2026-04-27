async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .deepseek your text here"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤖 *deepseek*\n\n" + input + "\n\n✅ AI command is active. API logic will be connected next."
  });
}

module.exports = {
  name: "deepseek",
  description: "Deep reasoning assistant",
  execute
};
