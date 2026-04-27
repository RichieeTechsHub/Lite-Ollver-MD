async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *resetsetting* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "resetsetting", description: "resetsetting command", execute };
