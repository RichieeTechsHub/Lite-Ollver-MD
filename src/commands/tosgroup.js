async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *tosgroup* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "tosgroup", description: "tosgroup command", execute };
