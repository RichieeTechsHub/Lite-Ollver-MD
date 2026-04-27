async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *approve* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "approve", description: "approve command", execute };
