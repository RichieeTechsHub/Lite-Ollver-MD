async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *testwelcome* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "testwelcome", description: "testwelcome command", execute };
