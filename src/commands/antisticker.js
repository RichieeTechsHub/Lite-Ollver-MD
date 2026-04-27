async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *antisticker* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "antisticker", description: "antisticker command", execute };
