async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "xvideo" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .xvideo disabled"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🎥 XVideo command disabled for safety.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "xvideo",
  description: "🎥 XVideo command disabled for safety.",
  execute
};
