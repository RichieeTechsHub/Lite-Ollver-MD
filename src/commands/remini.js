async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *remini* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "remini", description: "remini command", execute };
