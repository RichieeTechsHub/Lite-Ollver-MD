async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *leave* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "leave", description: "leave command", execute };
