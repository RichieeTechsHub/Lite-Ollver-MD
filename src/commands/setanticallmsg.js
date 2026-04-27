async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setanticallmsg* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "setanticallmsg", description: "setanticallmsg command", execute };
