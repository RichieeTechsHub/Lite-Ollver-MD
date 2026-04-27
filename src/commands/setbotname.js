async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *setbotname* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "setbotname", description: "setbotname command", execute };
