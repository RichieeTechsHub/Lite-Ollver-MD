async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *anticall* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "anticall", description: "anticall command", execute };
