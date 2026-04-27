async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "🏓 Pong 2! Bot is alive."
  });
}

module.exports = {
  name: "ping2",
  description: "Second ping command",
  execute
};
