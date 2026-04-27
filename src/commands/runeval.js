async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *runeval* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "runeval", description: "runeval command", execute };
