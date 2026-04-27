async function execute(sock, msg, args) {
  const song = args.join(" ");
  if (!song) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .lyrics song name" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🎵 *LYRICS SEARCH*\n\nSong: " + song + "\n\n✅ Lyrics command active. Lyrics API will be connected next."
  });
}

module.exports = { name: "lyrics", description: "Search song lyrics", execute };
