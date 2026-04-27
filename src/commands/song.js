async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "song" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .song calm down rema"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🎧 Song search ready. Send song name.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "song",
  description: "🎧 Song search ready. Send song name.",
  execute
};
