async function execute(sock, msg, args) {
  const input = args.join(" ");

  if (!input && "gitclone" !== "savestatus") {
    return sock.sendMessage(msg.key.remoteJid, {
      text: "❌ Usage: .gitclone https://github.com/user/repo"
    });
  }

  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "🐙 Git clone helper ready. Send GitHub repo URL.\n\n" +
      (input ? "📌 Input: " + input + "\n\n" : "") +
      "✅ Command is working. Downloader API integration comes next."
  });
}

module.exports = {
  name: "gitclone",
  description: "🐙 Git clone helper ready. Send GitHub repo URL.",
  execute
};
