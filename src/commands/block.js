async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *block* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "block", description: "block command", execute };
