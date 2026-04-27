async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *alwaysonline* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "alwaysonline", description: "alwaysonline command", execute };
