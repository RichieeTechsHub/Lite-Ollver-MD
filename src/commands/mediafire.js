async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "mediafire" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .mediafire <mediafire link>"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🔥 MediaFire downloader ready. Send MediaFire link.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "mediafire",
  description: "🔥 MediaFire downloader ready. Send MediaFire link.",
  execute
};
