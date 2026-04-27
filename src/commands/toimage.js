async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *toimage* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "toimage", description: "toimage command", execute };
