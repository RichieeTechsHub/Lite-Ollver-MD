async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *helpers* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "helpers", description: "helpers command", execute };
