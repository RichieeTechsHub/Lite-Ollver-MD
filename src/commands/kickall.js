async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *kickall* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "kickall", description: "kickall command", execute };
