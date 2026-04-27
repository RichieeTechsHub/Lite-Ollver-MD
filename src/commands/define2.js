async function execute(sock, msg, args) {
  const word = args.join(" ");
  if (!word) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .define2 word" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📖 *DEFINE 2*\n\nWord: " + word + "\n\n✅ Alternative dictionary command active."
  });
}

module.exports = { name: "define2", description: "Alternative define command", execute };
