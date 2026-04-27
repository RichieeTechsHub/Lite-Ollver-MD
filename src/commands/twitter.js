async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "twitter" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .twitter <x/twitter link>"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "𝕏 Twitter/X downloader ready. Send tweet/video URL.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "twitter",
  description: "𝕏 Twitter/X downloader ready. Send tweet/video URL.",
  execute
};
