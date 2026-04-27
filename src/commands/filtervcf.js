async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *filtervcf* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "filtervcf", description: "filtervcf command", execute };
