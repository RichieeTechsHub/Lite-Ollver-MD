async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *showanticallmsg* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "showanticallmsg", description: "showanticallmsg command", execute };
