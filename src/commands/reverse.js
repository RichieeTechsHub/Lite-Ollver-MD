async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *reverse* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "reverse", description: "reverse command", execute };
