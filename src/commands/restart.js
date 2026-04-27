async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *restart* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "restart", description: "restart command", execute };
