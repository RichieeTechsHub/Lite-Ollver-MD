async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antidelete* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "antidelete", description: "antidelete command", execute };
