async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *link* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "link", description: "link command", execute };
