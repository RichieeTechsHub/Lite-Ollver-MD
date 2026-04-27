async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *song* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "song", description: "song command", execute };
