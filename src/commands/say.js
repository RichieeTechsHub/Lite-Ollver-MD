async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *say* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "say", description: "say command", execute };
