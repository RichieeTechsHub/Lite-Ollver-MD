async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *fancy* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "fancy", description: "fancy command", execute };
