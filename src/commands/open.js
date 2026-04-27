async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *open* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "open", description: "open command", execute };
