async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *quotes* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "quotes", description: "quotes command", execute };
