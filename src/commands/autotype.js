async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *autotype* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "autotype", description: "autotype command", execute };
