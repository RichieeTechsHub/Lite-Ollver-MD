async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "itunes" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .itunes burna boy"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🎵 iTunes search ready. Send song/artist name.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "itunes",
  description: "🎵 iTunes search ready. Send song/artist name.",
  execute
};
