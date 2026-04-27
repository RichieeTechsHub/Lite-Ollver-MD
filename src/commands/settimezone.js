async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *settimezone* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "settimezone", description: "settimezone command", execute };
