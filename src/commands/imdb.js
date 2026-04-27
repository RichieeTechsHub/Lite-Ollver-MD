async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *imdb* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "imdb", description: "imdb command", execute };
