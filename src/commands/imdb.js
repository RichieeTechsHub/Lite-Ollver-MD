async function execute(sock, msg, args) {
  const movie = args.join(" ");
  if (!movie) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .imdb movie name" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎬 *IMDB SEARCH*\n\nMovie: " + movie + "\n\n✅ Movie search command active. IMDB API will be connected next."
  });
}

module.exports = { name: "imdb", description: "Search movie info", execute };
