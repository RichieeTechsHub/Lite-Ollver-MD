async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antiviewonce* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "antiviewonce", description: "antiviewonce command", execute };
