async function execute(sock, msg, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "⚠️ Runeval is disabled for security."
  });
}

module.exports = { name: "runeval", description: "Disabled eval", execute };
