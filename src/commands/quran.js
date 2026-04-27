async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .quran 1:1"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "☪️ *QURAN SEARCH*\n\n" +
      "Ayah requested: " + query + "\n\n" +
      "✅ Quran command is active. Quran API will be connected next."
  });
}

module.exports = {
  name: "quran",
  description: "Search Quran ayah",
  execute
};
