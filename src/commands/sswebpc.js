async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *sswebpc* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "sswebpc", description: "sswebpc command", execute };
