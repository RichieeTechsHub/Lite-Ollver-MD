async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *tourl* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "tourl", description: "tourl command", execute };
