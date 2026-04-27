async function execute(sock, msg) {
  const start = Date.now();

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏓 Pong!\n⚡ Speed: " + (Date.now() - start) + " ms"
  });
}

module.exports = {
  name: "ping",
  description: "Check bot response",
  execute
};
