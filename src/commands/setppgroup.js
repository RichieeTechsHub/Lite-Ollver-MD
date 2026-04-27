async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setppgroup* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "setppgroup", description: "setppgroup command", execute };
