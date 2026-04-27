async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏟️ *CHAMPIONS LEAGUE MATCHES*\n\n✅ Command active. UCL API will be connected next."
  });
}

module.exports = { name: "clmatches", description: "Champions League matches", execute };
