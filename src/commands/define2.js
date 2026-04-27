async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *define2* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "define2", description: "define2 command", execute };
