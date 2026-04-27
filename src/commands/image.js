async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .image cat"
    });
  }

  const url = "https://source.unsplash.com/900x900/?" + encodeURIComponent(query);

  await sock.sendMessage(msg.key.remoteJid, {
    image: { url },
    caption: "🖼️ Image result for: " + query
  });
}

module.exports = {
  name: "image",
  description: "Search image",
  execute
};
