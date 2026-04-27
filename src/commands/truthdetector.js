async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *truthdetector* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "truthdetector", description: "truthdetector command", execute };
