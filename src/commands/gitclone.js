async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *gitclone* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "gitclone", description: "gitclone command", execute };
