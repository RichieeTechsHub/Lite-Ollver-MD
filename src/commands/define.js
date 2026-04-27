async function execute(sock, msg, args) {
  const word = args.join(" ");
  if (!word) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .define word" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📚 *DEFINE*\n\nWord: " + word + "\n\n✅ Command active. Dictionary API will be connected next."
  });
}

module.exports = { name: "define", description: "Define a word", execute };
