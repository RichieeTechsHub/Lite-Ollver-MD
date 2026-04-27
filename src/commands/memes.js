async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *memes* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "memes", description: "memes command", execute };
