async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *mode* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "mode", description: "mode command", execute };
