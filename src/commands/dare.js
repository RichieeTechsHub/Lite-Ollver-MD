async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🔥 *DARE*\n\nSend a voice note confessing your crush 😭"
  });
}

module.exports = {
  name: "dare",
  description: "Get a random dare",
  execute
};
