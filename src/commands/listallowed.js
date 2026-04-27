async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *listallowed* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "listallowed", description: "listallowed command", execute };
