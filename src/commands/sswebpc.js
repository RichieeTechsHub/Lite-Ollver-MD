async function execute(sock, msg, args) {
  const url = args[0];
  if (!url) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .sswebpc https://example.com" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "🖥️ PC screenshot request received for: " + url
  });
}

module.exports = { name: "sswebpc", description: "PC website screenshot", execute };
