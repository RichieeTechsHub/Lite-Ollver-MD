async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "✅ *opentime* command is working.\n\n⚙️ Advanced logic will be added next."
  });
}

module.exports = { name: "opentime", description: "opentime command", execute };
