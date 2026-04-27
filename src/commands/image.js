async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *image* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "image", description: "image command", execute };
