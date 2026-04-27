async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "tiktok" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .tiktok <tiktok link>"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🎬 TikTok downloader ready. Send TikTok URL.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "tiktok",
  description: "🎬 TikTok downloader ready. Send TikTok URL.",
  execute
};
