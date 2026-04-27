async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *listwarn* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "listwarn", description: "listwarn command", execute };
