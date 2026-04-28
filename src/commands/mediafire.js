async function execute(sock, msg, args) {
  const url = args[0];

  if (!url) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .mediafire mediafire link",
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📁 *MediaFire Link Received*\n\n" +
      url +
      "\n\nDownloader will be upgraded after command loading is stable.",
  });
}

module.exports = {
  name: "mediafire",
  description: "MediaFire helper",
  execute,
};
