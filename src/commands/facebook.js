async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *facebook* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "facebook", description: "facebook command", execute };
