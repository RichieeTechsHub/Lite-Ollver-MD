async function execute(sock, msg, args) {
  const query = args.join(" ");
  if (!query) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .browse search query" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🌐 *BROWSE*\n\nQuery: " + query + "\n\nSearch API will be connected next."
  });
}

module.exports = { name: "browse", description: "Browse/search web", execute };
