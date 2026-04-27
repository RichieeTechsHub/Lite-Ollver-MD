async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *deletebadword* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "deletebadword", description: "deletebadword command", execute };
