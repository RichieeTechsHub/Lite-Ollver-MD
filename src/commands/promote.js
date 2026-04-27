async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *promote* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "promote", description: "promote command", execute };
