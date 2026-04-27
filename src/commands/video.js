async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *video* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "video", description: "video command", execute };
