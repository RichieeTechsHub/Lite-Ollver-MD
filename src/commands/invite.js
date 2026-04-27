async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *invite* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "invite", description: "invite command", execute };
