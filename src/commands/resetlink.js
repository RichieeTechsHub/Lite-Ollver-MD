async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *resetlink* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "resetlink", description: "resetlink command", execute };
