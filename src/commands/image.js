async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "image" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .image lion wallpaper"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🖼️ Image search command ready. Send search term.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "image",
  description: "🖼️ Image search command ready. Send search term.",
  execute
};
