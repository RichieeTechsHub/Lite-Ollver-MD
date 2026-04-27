async function execute(sock, msg, args) {
  const url = args[0];
  if (!url) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .sswebtab https://example.com" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📱 Tablet screenshot request received for: " + url
  });
}

module.exports = { name: "sswebtab", description: "Tablet website screenshot", execute };
