async function execute(sock, msg, args) {
  const query = args.join(" ");

  if (!query) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .pin cars"
    });
  }

  const url = "https://source.unsplash.com/900x900/?" + encodeURIComponent(query + " pinterest");

  await sock.sendMessage(msg.key.remoteJid, {
    image: { url },
    caption: "📌 Pinterest-style image for: " + query
  });
}

module.exports = {
  name: "pin",
  description: "Pinterest image search",
  execute
};
