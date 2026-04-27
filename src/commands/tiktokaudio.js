async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "tiktokaudio" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .tiktokaudio <tiktok link>"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🎵 TikTok audio downloader ready. Send TikTok URL.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "tiktokaudio",
  description: "🎵 TikTok audio downloader ready. Send TikTok URL.",
  execute
};
