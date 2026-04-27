async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *dare* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "dare", description: "dare command", execute };
