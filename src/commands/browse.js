async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *browse* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "browse", description: "browse command", execute };
