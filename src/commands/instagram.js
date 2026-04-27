async function execute(sock, msg, args) {
  const url = args[0];

  if (!url || !url.includes("instagram")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .instagram Instagram reel/post link"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "⚠️ Instagram downloader needs a stable API/cookie session to work reliably on Heroku.\n\n" +
      "Link received:\n" + url + "\n\n" +
      "Next we can connect a real Instagram API provider or cookies-based downloader."
  });
}

module.exports = {
  name: "instagram",
  description: "Instagram downloader",
  execute
};
