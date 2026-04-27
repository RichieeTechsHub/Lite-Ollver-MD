async function execute(sock, msg, args) {
  const url = args[0];
  if (!url) return sock.sendMessage(msg.key.remoteJid, { text: "❌ Usage: .tinyurl https://example.com" });

  try {
    const res = await fetch("https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url));
    const short = await res.text();

    await sock.sendMessage(msg.key.remoteJid, {
      text: "🔗 *Short URL*\n\n" + short
    });
  } catch {
    await sock.sendMessage(msg.key.remoteJid, { text: "❌ Failed to shorten URL." });
  }
}

module.exports = { name: "tinyurl", description: "Shorten URL", execute };
