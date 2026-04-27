async function execute(sock, msg, args) {
  const text = args.join(" ");

  if (!text) {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .translate hello to swahili"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🌍 *TRANSLATE*\n\n" +
      "Input: " + text + "\n\n" +
      "✅ Translate command active. Translation API will be connected next."
  });
}

module.exports = {
  name: "translate",
  description: "Translate text",
  execute
};
