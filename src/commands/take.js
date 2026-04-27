async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *take* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "take", description: "take command", execute };
