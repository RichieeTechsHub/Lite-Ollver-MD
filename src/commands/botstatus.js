async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *botstatus* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "botstatus", description: "botstatus command", execute };
