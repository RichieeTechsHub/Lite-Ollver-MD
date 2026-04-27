async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *lyrics* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "lyrics", description: "lyrics command", execute };
