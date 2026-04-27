async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *tag* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "tag", description: "tag command", execute };
