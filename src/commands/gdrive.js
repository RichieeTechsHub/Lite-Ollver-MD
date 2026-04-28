async function execute(sock, msg, args) {
  const url = args[0];

  if (!url || !url.includes("drive.google.com")) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .gdrive Google-Drive-public-link",
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "✅ Google Drive link received.\n\n" +
      "Direct Drive downloading needs a public file with permission set to anyone with link.\n\n" +
      "Link:\n" + url,
  });
}

module.exports = {
  name: "gdrive",
  description: "Google Drive link helper",
  execute,
};
