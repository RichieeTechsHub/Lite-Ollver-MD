async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *vcf* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "vcf", description: "vcf command", execute };
