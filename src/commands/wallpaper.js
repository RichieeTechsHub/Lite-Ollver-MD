async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .wallpaper cars"
    });
  }

  const url = "https://source.unsplash.com/1080x1920/?" + encodeURIComponent(query);

  await sock.sendMessage(msg.key.remoteJid, {
    image: { url },
    caption: "🖼️ Wallpaper for: " + query
  });
}

module.exports = {
  name: "wallpaper",
  description: "Search wallpaper",
  execute
};
