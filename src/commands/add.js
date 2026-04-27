async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *add* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "add", description: "add command", execute };
