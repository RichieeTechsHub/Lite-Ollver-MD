async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *volvideo* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "volvideo", description: "volvideo command", execute };
