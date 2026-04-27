async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *addignorelist* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "addignorelist", description: "addignorelist command", execute };
