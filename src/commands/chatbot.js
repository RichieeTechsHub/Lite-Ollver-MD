async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *chatbot* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "chatbot", description: "chatbot command", execute };
