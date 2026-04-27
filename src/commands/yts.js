async function execute(sock, msg, args) {
  const query = args.join(" ");
  if (!query) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .yts song/video name" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "▶️ *YOUTUBE SEARCH*\n\nQuery: " + query + "\n\n✅ YouTube search command active. API will be connected next."
  });
}

module.exports = { name: "yts", description: "YouTube search", execute };
