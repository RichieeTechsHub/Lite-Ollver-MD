async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🤼 *WWE NEWS*\n\n✅ Command active. Sports news API will be connected next."
  });
}

module.exports = { name: "wwenews", description: "WWE news", execute };
