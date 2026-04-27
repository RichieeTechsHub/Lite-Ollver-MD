async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "video" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .video funny cats"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🎥 Video search ready. Send video name or link.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "video",
  description: "🎥 Video search ready. Send video name or link.",
  execute
};
