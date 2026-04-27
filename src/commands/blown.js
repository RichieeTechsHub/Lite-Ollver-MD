async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *blown* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "blown", description: "blown command", execute };
