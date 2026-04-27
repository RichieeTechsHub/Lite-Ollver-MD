async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, { text: "🏓 Pong!" });
}

module.exports = { name: "ping2", description: "Ping command", execute };
