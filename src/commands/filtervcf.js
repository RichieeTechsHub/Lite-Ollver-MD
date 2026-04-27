async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "📇 *FILTER VCF*\n\nReply to a .vcf document. VCF filtering engine will be connected next."
  });
}

module.exports = { name: "filtervcf", description: "Filter VCF contacts", execute };
