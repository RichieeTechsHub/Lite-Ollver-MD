async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *join* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "join", description: "join command", execute };
