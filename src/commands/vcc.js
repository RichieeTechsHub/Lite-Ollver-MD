async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *vcc* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "vcc", description: "vcc command", execute };
