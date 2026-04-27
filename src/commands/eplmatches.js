async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *eplmatches* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "eplmatches", description: "eplmatches command", execute };
