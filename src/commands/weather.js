async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *weather* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "weather", description: "weather command", execute };
