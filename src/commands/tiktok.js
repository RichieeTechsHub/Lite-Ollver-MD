async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *tiktok* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "tiktok", description: "tiktok command", execute };
