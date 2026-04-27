async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "facebook" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .facebook <facebook video link>"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📘 Facebook downloader ready. Send Facebook video URL.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "facebook",
  description: "📘 Facebook downloader ready. Send Facebook video URL.",
  execute
};
