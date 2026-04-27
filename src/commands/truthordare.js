async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *truthordare* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "truthordare", description: "truthordare command", execute };
