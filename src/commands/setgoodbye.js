async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setgoodbye* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "setgoodbye", description: "setgoodbye command", execute };
