async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *hidetag* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "hidetag", description: "hidetag command", execute };
