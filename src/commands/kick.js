async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *kick* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "kick", description: "kick command", execute };
