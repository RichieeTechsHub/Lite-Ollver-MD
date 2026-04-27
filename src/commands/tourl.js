async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🔗 Reply to media with .tourl. Upload engine will be connected next."
  });
}

module.exports = { name: "tourl", description: "Upload media to URL", execute };
