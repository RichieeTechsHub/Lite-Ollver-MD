async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *delcode* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "delcode", description: "delcode command", execute };
