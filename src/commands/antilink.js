async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antilink* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "antilink", description: "antilink command", execute };
