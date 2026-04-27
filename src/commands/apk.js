async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "apk" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .apk whatsapp"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📦 APK search received. Send app name after .apk\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "apk",
  description: "📦 APK search received. Send app name after .apk",
  execute
};
