async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *instagram* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "instagram", description: "instagram command", execute };
