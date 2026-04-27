async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "telesticker" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .telesticker <telegram sticker url>"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📦 Telegram sticker downloader ready. Send sticker pack URL.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "telesticker",
  description: "📦 Telegram sticker downloader ready. Send sticker pack URL.",
  execute
};
