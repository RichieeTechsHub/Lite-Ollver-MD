async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *quran* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "quran", description: "quran command", execute };
