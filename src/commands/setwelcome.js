async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setwelcome* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "setwelcome", description: "setwelcome command", execute };
