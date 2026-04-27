async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *repo* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "repo", description: "repo command", execute };
