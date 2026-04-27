async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "gdrive" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .gdrive <drive link>"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "☁️ Google Drive downloader ready. Send public Google Drive link.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "gdrive",
  description: "☁️ Google Drive downloader ready. Send public Google Drive link.",
  execute
};
