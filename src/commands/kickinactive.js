async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *kickinactive* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "kickinactive", description: "kickinactive command", execute };
