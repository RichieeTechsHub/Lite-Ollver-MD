async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .wallpaper cars"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🖼️ *Wallpaper Search*\n\n" +
      "Query: " + query + "\n\n" +
      "✅ Command is working. Wallpaper API will be connected next."
  });
}

module.exports = {
  name: "wallpaper",
  description: "Search wallpaper",
  execute
};
