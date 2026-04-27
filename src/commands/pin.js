async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "pin" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .pin cars"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📌 Pinterest search ready. Send search term.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "pin",
  description: "📌 Pinterest search ready. Send search term.",
  execute
};
