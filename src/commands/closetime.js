async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *closetime* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "closetime", description: "closetime command", execute };
