async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚽ *EPL MATCHES*\n\n✅ Command active. Live football API will be connected next."
  });
}

module.exports = { name: "eplmatches", description: "EPL matches", execute };
