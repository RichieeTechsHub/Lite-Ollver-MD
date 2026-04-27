async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *emojimix* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "emojimix", description: "emojimix command", execute };
