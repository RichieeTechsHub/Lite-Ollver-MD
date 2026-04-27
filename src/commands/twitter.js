async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *twitter* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "twitter", description: "twitter command", execute };
