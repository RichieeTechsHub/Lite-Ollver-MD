async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *listcode* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "listcode", description: "listcode command", execute };
