async function execute(sock, msg, args) {
  const text = args.join(" ");
  if (!text) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .fancy hello" });

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "✨ *FANCY TEXT*\n\n" +
      "𝙁𝘼𝙉𝘾𝙔: " + text.toUpperCase() + "\n" +
      "𝓕𝓪𝓷𝓬𝔂: " + text + "\n" +
      "𝗕𝗼𝗹𝗱: " + text
  });
}

module.exports = { name: "fancy", description: "Fancy text", execute };
