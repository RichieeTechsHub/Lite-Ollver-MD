async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *toptt* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "toptt", description: "toptt command", execute };
