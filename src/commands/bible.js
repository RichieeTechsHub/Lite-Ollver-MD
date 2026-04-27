async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *bible* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "bible", description: "bible command", execute };
