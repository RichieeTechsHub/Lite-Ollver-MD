async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "videodoc" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .videodoc <video link>"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📄 Video document mode ready. Send video URL.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "videodoc",
  description: "📄 Video document mode ready. Send video URL.",
  execute
};
