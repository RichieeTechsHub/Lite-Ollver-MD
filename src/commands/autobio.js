async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autobio* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "autobio", description: "autobio command", execute };
