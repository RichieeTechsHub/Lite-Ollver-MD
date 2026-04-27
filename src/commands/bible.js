async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .bible John 3:16"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📖 *BIBLE SEARCH*\n\n" +
      "Verse requested: " + query + "\n\n" +
      "✅ Bible command is active. Verse API will be connected next."
  });
}

module.exports = {
  name: "bible",
  description: "Search Bible verse",
  execute
};
