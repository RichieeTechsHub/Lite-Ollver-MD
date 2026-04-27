async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *approveall* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "approveall", description: "approveall command", execute };
