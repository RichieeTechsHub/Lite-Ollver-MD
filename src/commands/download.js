async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "download" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .download https://example.com/file.zip"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "⬇️ Download command active. Send a direct URL after .download\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "download",
  description: "⬇️ Download command active. Send a direct URL after .download",
  execute
};
