async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *disapproveall* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "disapproveall", description: "disapproveall command", execute };
