async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "song2" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .song2 calm down rema"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🎧 Alternative song search ready. Send song name.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "song2",
  description: "🎧 Alternative song search ready. Send song name.",
  execute
};
