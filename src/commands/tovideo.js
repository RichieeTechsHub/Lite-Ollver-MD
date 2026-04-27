async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *tovideo* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "tovideo", description: "tovideo command", execute };
