async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "savestatus" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .savestatus"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "💾 Reply to a status/media message to save it.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "savestatus",
  description: "💾 Reply to a status/media message to save it.",
  execute
};
