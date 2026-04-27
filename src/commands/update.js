async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *update* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "update", description: "update command", execute };
