async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antibug* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "antibug", description: "antibug command", execute };
