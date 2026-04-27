async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *deep* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "deep", description: "deep command", execute };
