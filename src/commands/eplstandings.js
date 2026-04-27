async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏆 *EPL STANDINGS*\n\n✅ Command active. Standings API will be connected next."
  });
}

module.exports = { name: "eplstandings", description: "EPL standings", execute };
