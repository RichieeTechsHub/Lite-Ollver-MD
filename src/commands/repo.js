async function execute(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text:
      "📦 *LITE-OLLVER-MD REPO*\n\n" +
      "GitHub: https://github.com/RichieeTechsHub/Lite-Ollver-MD"
  });
}

module.exports = {
  name: "repo",
  description: "Show bot repo",
  execute
};
