async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *fliptext* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "fliptext", description: "fliptext command", execute };
