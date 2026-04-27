async function execute(sock, msg, args) {
  const url = args[0];
  if (!url) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .ssweb https://example.com" });

  await sock.sendMessage(msg.key.remoteJid, {
    text: "📸 Screenshot request received for: " + url + "\nScreenshot API will be connected next."
  });
}

module.exports = { name: "ssweb", description: "Website screenshot", execute };
