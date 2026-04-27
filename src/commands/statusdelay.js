async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *statusdelay* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "statusdelay", description: "statusdelay command", execute };
