async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *pair* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "pair", description: "pair command", execute };
