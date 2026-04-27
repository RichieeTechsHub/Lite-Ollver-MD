async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *react* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "react", description: "react command", execute };
