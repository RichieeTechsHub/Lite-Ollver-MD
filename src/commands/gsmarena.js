async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *gsmarena* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "gsmarena", description: "gsmarena command", execute };
