async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *define* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "define", description: "define command", execute };
