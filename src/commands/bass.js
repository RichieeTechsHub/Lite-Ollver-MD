async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *bass* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "bass", description: "bass command", execute };
