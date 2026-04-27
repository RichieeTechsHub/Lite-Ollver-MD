async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *tomp3* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "tomp3", description: "tomp3 command", execute };
