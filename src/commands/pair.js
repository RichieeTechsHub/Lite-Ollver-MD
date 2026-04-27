async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🔐 *PAIR INFO*\n\n" +
      "This bot is already connected using SESSION_ID.\n" +
      "To pair a new number, use your session generator site."
  });
}

module.exports = {
  name: "pair",
  description: "Pairing information",
  execute
};
