async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "instagram" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .instagram <instagram link>"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📸 Instagram downloader ready. Send Instagram URL.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "instagram",
  description: "📸 Instagram downloader ready. Send Instagram URL.",
  execute
};
